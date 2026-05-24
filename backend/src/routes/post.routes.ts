import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getPosts, createPost, getPostById, updatePost, deletePost, getPostsByUser } from '../controllers/post.controller';

const router = Router();

router.get('/', getPosts);
router.post('/', authenticate, createPost);
router.get('/:id', getPostById);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);
router.get('/user/:userId', getPostsByUser);

export default router;
