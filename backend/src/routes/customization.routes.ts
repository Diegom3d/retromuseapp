import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
const router = Router();

router.get('/:userId', async (req, res) => res.json({ userId: req.params.userId, theme: {} }));
router.put('/:userId', authenticate, async (_req, res) => res.json({ message: 'Personalización guardada' }));

export default router;
