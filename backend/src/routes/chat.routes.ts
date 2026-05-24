import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
const router = Router();

router.get('/', authenticate, async (_req, res) => res.json({ chats: [] }));
router.post('/', authenticate, async (_req, res) => res.status(201).json({ message: 'Conversación iniciada' }));
router.get('/:id/messages', authenticate, async (req, res) => res.json({ messages: [] }));
router.post('/:id/messages', authenticate, async (_req, res) => res.status(201).json({ message: 'Enviado' }));

export default router;
