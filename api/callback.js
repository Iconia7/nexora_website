import { db } from './utils/firebaseAdmin.js';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const callbackData = req.body;
  console.log("----- CALLBACK RECEIVED -----", JSON.stringify(callbackData, null, 2));

  try {
    const { Body } = callbackData;

    // --- HANDLE TRANSACTION STATUS callback ---
    if (Body.Result) {
        const { ResultCode, ResultDesc, ConversationID, ResultParameters } = Body.Result;
        console.log("Transaction Status Callback for Conversation:", ConversationID);
        
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
            } else {
                await orderDoc.ref.update({
                    status: "FAILED",
                    failReason: ResultDesc
                });
            }
        } else {
            console.error("Order not found for Transaction Status ConversationID:", ConversationID);
        }
        return res.status(200).json({ result: "Ok" });
    }

    // --- HANDLE STK PUSH callback ---
    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;

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

    // Always respond 200 to Safaricom
    res.status(200).json({ result: "Ok" });
  } catch (error) {
    console.error("Callback Processing Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}