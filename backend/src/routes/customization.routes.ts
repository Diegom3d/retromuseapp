import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getCustomization, updateCustomization } from '../controllers/customization.controller';

const router = Router();

router.get('/:userId', getCustomization);
router.put('/:userId', authenticate, updateCustomization);

export default router;
