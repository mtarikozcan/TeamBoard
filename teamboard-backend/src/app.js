import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './src/routes/auth.js';
import projectRoutes from './src/routes/projects.js';
import taskRoutes from './src/routes/tasks.js';
import commentRoutes from './src/routes/comments.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 dakika
  max: 100,
  message: { error: 'Çok fazla istek gönderildi, lütfen bir dakika bekleyin.' },
});
app.use('/api', limiter);

// Body parser
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı.' });
});

// Error handler (en sonda)
app.use(errorHandler);

export default app;
