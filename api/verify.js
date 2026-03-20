// api/verify.js
import axios from 'axios';
import { db } from './utils/firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send({ message: 'Only POST requests allowed' });

  const { transactionID, orderId } = req.body;
  if (!transactionID || !orderId) return res.status(400).json({ error: "Transaction ID and Order ID are required" });

  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const initiator = process.env.MPESA_INITIATOR_NAME;
  const securityCredential = process.env.MPESA_SECURITY_CREDENTIAL;
  const shortCode = process.env.MPESA_SHORTCODE;

  // Check if we have the necessary keys
  if (!initiator || !securityCredential) {
      return res.status(503).json({ 
          error: "Verification service not configured", 
          details: "Missing MPESA_INITIATOR_NAME or MPESA_SECURITY_CREDENTIAL in environment variables." 
      });
  }

  try {
    // 1. Generate Auth Token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenResponse = await axios.get(
      'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const accessToken = tokenResponse.data.access_token;

    // 2. Query Transaction Status
    // Note: In a real production environment, you might need a ResultURL/QueueTimeOutURL 
    // for asynchronous processing, but some implementations return immediate status or used for manual checks.
    // However, for direct manual verification, we call the query endpoint.
    
    const response = await axios.post(
      'https://api.safaricom.co.ke/mpesa/transactionstatus/v1/query',
      {
        Initiator: initiator,
        SecurityCredential: securityCredential,
        CommandID: "TransactionStatusQuery",
        TransactionID: transactionID,
        PartyA: shortCode,
        IdentifierType: "4", // Shortcode
        ResultURL: process.env.MPESA_CALLBACK_URL, // Safaricom requires these even for sync-like behavior
        QueueTimeOutURL: process.env.MPESA_CALLBACK_URL,
        Remarks: "Manual Admin Verification",
        Occasion: "Verification"
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Safaricom usually responds with an acknowledgment of the request.
    // In many cases, the actual result comes to the ResultURL.
    // For this specific use case, we will notify the user that the request was sent.
    
    // Save mapping to Firebase so the callback knows which order this is
    if (response.data && response.data.ConversationID) {
      const orderRef = db.collection("orders").doc(orderId);
      await orderRef.update({
          status: "VERIFYING",
          mpesaReceipt: transactionID,
          verificationConversationID: response.data.ConversationID
      });
    }

    res.status(200).json({ 
        message: "Verification request sent to Safaricom.", 
        raw: response.data 
    });

  } catch (error) {
    console.error("Verification Error:", error.response?.data || error.message);
    res.status(500).json({ 
        error: "Failed to communicate with Safaricom", 
        details: error.response?.data || error.message 
    });
  }
}
