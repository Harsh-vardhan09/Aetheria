import { Router } from 'express';
import { getMe, updateMe, deleteMe } from '../controllers/userController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);
router.delete('/me', authMiddleware, deleteMe);

export default router;