import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getCommentsByPost, createComment, updateComment, deleteComment } from '../controllers/comment.controller';

const router = Router();

router.get('/post/:postId', getCommentsByPost);
router.post('/', authenticate, createComment);
router.put('/:id', authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

export default router;
