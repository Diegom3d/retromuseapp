import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
const router = Router();

router.post('/:postId', authenticate, async (req, res) => res.status(201).json({ message: 'Like dado' }));
router.delete('/:postId', authenticate, async (req, res) => res.json({ message: 'Like quitado' }));
router.get('/:postId/count', async (req, res) => res.json({ postId: req.params.postId, count: 0 }));

export default router;
