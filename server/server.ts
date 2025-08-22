// server/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import flashcardRoutes from './routes/flashcardRoutes';
import progressRoutes from './routes/progressRoutes';

// Remove dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ 
  origin: process.env.CLIENT_URL, 
  credentials: true 
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API Running...');
});

connectDB();

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on :${port}`);
});

export default app;
