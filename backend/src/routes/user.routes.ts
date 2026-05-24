import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getUsers, getUserById, updateProfile, deleteUser } from '../controllers/user.controller';
import { toggleFollow, getFollowers, getFollowing } from '../controllers/follower.controller';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', authenticate, updateProfile);
router.delete('/:id', authenticate, deleteUser);

router.post('/:id/follow', authenticate, toggleFollow);
router.delete('/:id/follow', authenticate, toggleFollow);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

export default router;
