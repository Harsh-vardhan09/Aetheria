import { Router } from 'express';
import { getSuggestions } from '../controllers/owlController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get('/suggestions', authMiddleware, getSuggestions);

export default router;