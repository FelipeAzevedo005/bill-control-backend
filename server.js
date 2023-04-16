import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';

import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api', transactionRoutes);

app.listen(port, () => console.log(`running on port ${port}`));
