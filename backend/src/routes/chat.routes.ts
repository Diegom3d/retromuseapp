import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getChats, createChat, getMessages, sendMessage } from '../controllers/chat.controller';

const router = Router();

router.get('/', authenticate, getChats);
router.post('/', authenticate, createChat);
router.get('/:id/messages', authenticate, getMessages);
router.post('/:id/messages', authenticate, sendMessage);

export default router;
