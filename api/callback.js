import { db } from './utils/firebaseAdmin.js';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const callbackData = req.body;
  console.log("----- CALLBACK RECEIVED -----", JSON.stringify(callbackData, null, 2));

  try {
    // 1. DETECT THE CALLBACK TYPE (STK Push vs Transaction Status)
    // STK Pushes are wrapped in { Body: { stkCallback: ... } }
    // Transaction Queries are often just { Result: { ... } }
    const result = callbackData.Result || callbackData.Body?.Result;
    const stkCallback = callbackData.Body?.stkCallback;

    // --- CASE A: HANDLE TRANSACTION STATUS (Verification) ---
    if (result) {
        const { ResultCode, ResultDesc, ConversationID, ResultParameters } = result;
        console.log(`Verification Callback: Code ${ResultCode} for Conversation ${ConversationID}`);
        
        const orderQuery = await db.collection("orders")
          .where("verificationConversationID", "==", ConversationID)
          .limit(1)
          .get();
          
        if (!orderQuery.empty) {
            const orderDoc = orderQuery.docs[0];
            if (ResultCode === 0) {
                const params = ResultParameters?.ResultParameter || [];
                const receipt = params.find(p => p.Key === "ReceiptNo")?.Value;
                const paidAmount = params.find(p => p.Key === "Amount")?.Value;
                
                await orderDoc.ref.update({
                    status: `PAID (Confirmed: ${receipt || orderDoc.data().mpesaReceipt})`,
                    paidAt: Timestamp.now(),
                    ...(paidAmount && { paidAmount })
                });
                console.log(`✅ Order ${orderDoc.id} Verified as PAID.`);
            } else {
                await orderDoc.ref.update({
                    status: "FAILED",
                    failReason: ResultDesc
                });
                console.log(`❌ Order ${orderDoc.id} Verification REJECTED: ${ResultDesc}`);
            }
        } else {
            console.error("Order not found for Transaction Status ConversationID:", ConversationID);
        }
        return res.status(200).json({ result: "Ok" });
    }

    // --- CASE B: HANDLE STK PUSH ---
    if (stkCallback) {
      const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback;

    // 1. FIND THE ORDER IN FIREBASE
    const orderQuery = await db.collection("orders")
      .where("checkoutRequestID", "==", CheckoutRequestID)
      .limit(1)
      .get();

    if (!orderQuery.empty) {
        const orderDoc = orderQuery.docs[0];

        if (ResultCode === 0) {
            // --- SUCCESS CASE ---
            const metaData = CallbackMetadata.Item;
            const receiptNumber = metaData.find(o => o.Name === 'MpesaReceiptNumber')?.Value;
            const paidAmount = metaData.find(o => o.Name === 'Amount')?.Value;

            console.log(`✅ Order ${CheckoutRequestID} CONFIRMED. Receipt: ${receiptNumber}`);

            await orderDoc.ref.update({
                status: "PAID",
                mpesaReceipt: receiptNumber,
                paidAt: Timestamp.now(),
                paidAmount: paidAmount
            });
        } else {
            // --- FAILED/CANCELLED CASE ---
            console.log(`❌ Order ${CheckoutRequestID} FAILED.`);
            await orderDoc.ref.update({
                status: "FAILED",
                failReason: ResultDesc
            });
        }
    } else {
        console.error("⚠️ Order not found in database for CheckoutID:", CheckoutRequestID);
    }
    } // This is the added closing brace for the if (stkCallback) block
    
    // Always respond 200 to Safaricom
    res.status(200).json({ result: "Ok" });
  } catch (error) {
    console.error("Callback Processing Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}