import { Router } from 'express';
import { getHouseCup, getWizards } from '../controllers/leaderboardController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get('/house-cup', authMiddleware, getHouseCup);
router.get('/wizards', authMiddleware, getWizards);

export default router;