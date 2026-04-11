import { Router } from 'express';
import { getSpells, getActiveSpell, activateSpell, deactivateSpell } from '../controllers/spellController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getSpells);
router.get('/active', authMiddleware, getActiveSpell);
router.post('/activate', authMiddleware, activateSpell);
router.patch('/:id/deactivate', authMiddleware, deactivateSpell);

export default router;