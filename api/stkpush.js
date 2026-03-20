import axios from 'axios';
import { format } from 'date-fns';
import { db } from './utils/firebaseAdmin.js';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send({ message: 'Only POST requests allowed' });

  // --- API PROTECTION: Confirm request is from our domain ---
  const allowedOrigin = "https://nexoracreatives.co.ke";
  const origin = req.headers.origin || req.headers.referer;

  if (!origin || !origin.startsWith(allowedOrigin)) {
    console.warn(`Blocked unauthorized API call from: ${origin}`);
    return res.status(403).json({ error: "Access Denied: Unauthorized Domain" });
  }

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

    const timestamp = format(new Date(), 'yyyyMMddHHmmss');
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

    // 3. --- SAVE TO FIREBASE ---
    // We use the CheckoutRequestID as the unique key to link this order
    const checkoutRequestID = stkResponse.data.CheckoutRequestID;

    await db.collection("orders").add({
        checkoutRequestID: checkoutRequestID,
        phone: formattedPhone,
        amount: amount,
        status: "PENDING", // Initial status
        item: item || "Unknown Item",
        size: size || "N/A",
        createdAt: Timestamp.now(),
        mpesaReceipt: "" // Empty for now
    });

    res.status(200).json(stkResponse.data);

  } catch (error) {
    console.error("STK Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
}