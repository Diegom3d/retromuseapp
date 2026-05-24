import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

// ── Notifications ──────────────────────────────────────────
export const notificationRouter = Router();
notificationRouter.get('/', authenticate, async (_req, res) => res.json({ notifications: [] }));
notificationRouter.put('/:id/read', authenticate, async (req, res) => res.json({ message: 'Marcada como leída' }));
notificationRouter.delete('/:id', authenticate, async (req, res) => res.json({ message: 'Notificación eliminada' }));

// ── Chat (MongoDB) ─────────────────────────────────────────
export const chatRouter = Router();
chatRouter.get('/', authenticate, async (_req, res) => res.json({ chats: [] }));
chatRouter.post('/', authenticate, async (req, res) => res.status(201).json({ message: 'Conversación iniciada' }));
chatRouter.get('/:id/messages', authenticate, async (req, res) => res.json({ messages: [] }));
chatRouter.post('/:id/messages', authenticate, async (req, res) => res.status(201).json({ message: 'Mensaje enviado' }));

// ── Customization (MongoDB) ────────────────────────────────
export const customizationRouter = Router();
customizationRouter.get('/:userId', async (req, res) => res.json({ userId: req.params.userId, theme: {} }));
customizationRouter.put('/:userId', authenticate, async (req, res) => res.json({ message: 'Personalización guardada' }));
