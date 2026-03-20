import 'dotenv/config'; // Loads .env automatically
import express from 'express';
import cors from 'cors';

// Import your handlers
import stkpushHandler from './stkpush.js';
import queryHandler from './query.js';
import callbackHandler from './callback.js';
import verifyHandler from './verify.js'; // <-- Added verify.js!

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/stkpush', stkpushHandler);
app.post('/api/query', queryHandler);
app.post('/api/callback', callbackHandler);
app.post('/api/verify', verifyHandler); // <-- Added the route!

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 M-Pesa API running on port ${PORT}`));
