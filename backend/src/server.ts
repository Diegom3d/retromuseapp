import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

import { connectPostgres } from './config/postgres';
import { connectMongo } from './config/mongo';
import { swaggerSpec } from './config/swagger';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import commentRoutes from './routes/comment.routes';
import likeRoutes from './routes/like.routes';
import notificationRoutes from './routes/notification.routes';
import chatRoutes from './routes/chat.routes';
import customizationRoutes from './routes/customization.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ── Seguridad ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ── Rate limiting ──────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
});
app.use('/api/', limiter);

// ── Middleware ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// ── Swagger Docs ───────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Rutas ──────────────────────────────────────────────────
app.use('/api/auth',           authRoutes);
app.use('/api/users',          userRoutes);
app.use('/api/posts',          postRoutes);
app.use('/api/comments',       commentRoutes);
app.use('/api/likes',          likeRoutes);
app.use('/api/notifications',  notificationRoutes);
app.use('/api/chats',          chatRoutes);
app.use('/api/customization',  customizationRoutes);

// ── Health check ───────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 ────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ── Error handler ──────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Iniciar servidor ───────────────────────────────────────
const start = async () => {
  await connectPostgres();
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`🎨 RetroMuse API corriendo en http://localhost:${PORT}`);
    console.log(`📚 Docs disponibles en http://localhost:${PORT}/api-docs`);
  });
};

start().catch(console.error);

export default app;
