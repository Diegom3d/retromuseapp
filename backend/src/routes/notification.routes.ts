import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
const router = Router();

router.get('/', authenticate, async (_req, res) => res.json({ notifications: [] }));
router.put('/:id/read', authenticate, async (req, res) => res.json({ message: 'Marcada como leída' }));
router.delete('/:id', authenticate, async (req, res) => res.json({ message: 'Eliminada' }));

export default router;
