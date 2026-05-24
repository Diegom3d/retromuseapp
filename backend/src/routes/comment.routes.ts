// comment.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
const router = Router();

router.get('/post/:postId', async (req, res) => res.json({ postId: req.params.postId, comments: [] }));
router.post('/', authenticate, async (req, res) => res.status(201).json({ message: 'Comentario creado' }));
router.put('/:id', authenticate, async (req, res) => res.json({ message: 'Comentario actualizado' }));
router.delete('/:id', authenticate, async (req, res) => res.json({ message: 'Comentario eliminado' }));

export default router;
