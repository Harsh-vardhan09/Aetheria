import { Router } from 'express';
import { getStats, getXpHistory, getHouseBreakdown } from '../controllers/statsController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, getStats);
router.get('/xp-history', authMiddleware, getXpHistory);
router.get('/house-breakdown', authMiddleware, getHouseBreakdown);

export default router;