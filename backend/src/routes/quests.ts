import { Router } from 'express';
import {
  getQuests,
  createQuest,
  getQuest,
  updateQuest,
  deleteQuest,
  completeQuest,
  failQuest
} from '../controllers/questController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getQuests);
router.post('/', authMiddleware, createQuest);
router.get('/:id', authMiddleware, getQuest);
router.patch('/:id', authMiddleware, updateQuest);
router.delete('/:id', authMiddleware, deleteQuest);
router.post('/:id/complete', authMiddleware, completeQuest);
router.post('/:id/fail', authMiddleware, failQuest);

export default router;