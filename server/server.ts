// server/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import flashcardRoutes from './routes/flashcardRoutes';
import progressRoutes from './routes/progressRoutes';
import swaggerUi from 'swagger-ui-express';
import specs from './swaggerConfig';
import { i18nMiddleware } from './middleware/i18n';
import mongoose from 'mongoose';

// Remove dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 8080;

app.use(cors({ 
  origin: process.env.CLIENT_URL, 
  credentials: true 
}));
app.use(express.json());
app.use(i18nMiddleware);

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    db: dbStatus,
    timestamp: new Date().toISOString()
  });
});

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
