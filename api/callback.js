// api/callback.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

// Reuse Config
const firebaseConfig = {
  apiKey: "AIzaSyCPJs5TR3wtkbr1mkx-XbyAwQzAz6lNTZM",
  authDomain: "nexora-creative.firebaseapp.com",
  projectId: "nexora-creative",
  storageBucket: "nexora-creative.firebasestorage.app",
  messagingSenderId: "264622332898",
  appId: "1:264622332898:web:fc028517f0a986fcbd77bb",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const callbackData = req.body;
    console.log("----- CALLBACK RECEIVED -----", JSON.stringify(callbackData, null, 2));

    const resultCode = callbackData.Body.stkCallback.ResultCode;
    const checkoutRequestID = callbackData.Body.stkCallback.CheckoutRequestID;

    // 1. FIND THE ORDER IN FIREBASE
    // We query by CheckoutRequestID to find the document we created in stkpush.js
    const q = query(collection(db, "orders"), where("checkoutRequestID", "==", checkoutRequestID));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0]; // The specific order document
        const orderRef = doc(db, "orders", orderDoc.id);

        if (resultCode === 0) {
            // --- SUCCESS CASE ---
            const metaData = callbackData.Body.stkCallback.CallbackMetadata.Item;
            const receiptNumber = metaData.find(o => o.Name === 'MpesaReceiptNumber')?.Value;
            const paidAmount = metaData.find(o => o.Name === 'Amount')?.Value;

            console.log(`✅ Order ${checkoutRequestID} CONFIRMED. Receipt: ${receiptNumber}`);

            // Update Firebase
            await updateDoc(orderRef, {
                status: "PAID",
                mpesaReceipt: receiptNumber,
                paidAt: new Date(),
                paidAmount: paidAmount
            });

        } else {
            // --- FAILED/CANCELLED CASE ---
            console.log(`❌ Order ${checkoutRequestID} FAILED.`);
            await updateDoc(orderRef, {
                status: "FAILED",
                failReason: callbackData.Body.stkCallback.ResultDesc
            });
        }
    } else {
        console.error("⚠️ Order not found in database for CheckoutID:", checkoutRequestID);
    }

    // Always respond 200 to Safaricom
    res.status(200).json({ result: "Ok" });
  } else {
    res.status(405).end();
  }
}