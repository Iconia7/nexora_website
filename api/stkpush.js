// api/stkpush.js
import axios from 'axios';
import moment from 'moment';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// --- FIREBASE CONFIG (Same as your frontend) ---
const firebaseConfig = {
  apiKey: "AIzaSyCPJs5TR3wtkbr1mkx-XbyAwQzAz6lNTZM",
  authDomain: "nexora-creative.firebaseapp.com",
  projectId: "nexora-creative",
  storageBucket: "nexora-creative.firebasestorage.app",
  messagingSenderId: "264622332898",
  appId: "1:264622332898:web:fc028517f0a986fcbd77bb",
};

// Initialize only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send({ message: 'Only POST requests allowed' });

  // 1. RECEIVE MORE DATA (Item, Size, Color)
  const { phone, amount, item, size, accountRef } = req.body; 

  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const businessShortCode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  
  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenResponse = await axios.get(
      'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const accessToken = tokenResponse.data.access_token;

    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString('base64');

    let formattedPhone = phone.replace('+', '');
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.substring(1);

    const finalAccountRef = (accountRef || "Nexora Store").substring(0, 12);

    // 2. INITIATE STK PUSH
    const stkResponse = await axios.post(
      'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount, 
        PartyA: formattedPhone,
        PartyB: businessShortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL, 
        AccountReference: finalAccountRef,
        TransactionDesc: `Purchase: ${item?.name || 'Merch'}`
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // 3. --- SAVE TO FIREBASE (PENDING) ---
    // We use the CheckoutRequestID as the unique key to link this order
    const checkoutRequestID = stkResponse.data.CheckoutRequestID;

    await addDoc(collection(db, "orders"), {
        checkoutRequestID: checkoutRequestID,
        phone: formattedPhone,
        amount: amount,
        status: "PENDING", // Initial status
        item: item || "Unknown Item",
        size: size || "N/A",
        createdAt: new Date(),
        mpesaReceipt: "" // Empty for now
    });

    res.status(200).json(stkResponse.data);

  } catch (error) {
    console.error("STK Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
}