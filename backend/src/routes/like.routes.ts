import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { toggleLike, getLikeCount } from '../controllers/like.controller';

const router = Router();

router.post('/:postId', authenticate, toggleLike);
router.delete('/:postId', authenticate, toggleLike);
router.get('/:postId/count', getLikeCount);

export default router;
