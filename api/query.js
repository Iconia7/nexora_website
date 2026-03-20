import axios from 'axios';
import { format } from 'date-fns';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send({ message: 'Only POST allowed' });

  const { checkoutRequestID } = req.body;

  // --- 1. CREDENTIALS ---
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const businessShortCode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY; 

  try {
    // --- 2. GENERATE TOKEN ---
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenResponse = await axios.get(
      'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const accessToken = tokenResponse.data.access_token;

    // --- 3. GENERATE PASSWORD (Using date-fns) ---
    const timestamp = format(new Date(), 'yyyyMMddHHmmss');
    const password = Buffer.from(
      `${businessShortCode}${passkey}${timestamp}`
    ).toString('base64');

    // --- 4. QUERY SAFARICOM (THE FIX IS HERE) ---
    const queryResponse = await axios.post(
      'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      {
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID 
      },
      { 
        headers: { Authorization: `Bearer ${accessToken}` },
        // 👇 THIS LINE PREVENTS THE "403 CRASH"
        validateStatus: false 
      }
    );

    // --- 5. RETURN SAFARICOM'S RAW ANSWER ---
    // Even if Safaricom says 403/500, we send it to the frontend to analyze
    console.log("Safaricom Query Response:", queryResponse.data);
    res.status(200).json(queryResponse.data);

  } catch (error) {
    console.error("Query Error:", error.message);
    // Return a safe error so the frontend doesn't break
    res.status(200).json({ 
        ResultCode: "ERR", 
        ResultDesc: "System Error: " + error.message 
    });
  }
}