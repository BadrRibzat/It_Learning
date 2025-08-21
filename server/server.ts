
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import flashcardRoutes from './routes/flashcardRoutes';
import progressRoutes from './routes/progressRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API Running...');
});

connectDB();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
