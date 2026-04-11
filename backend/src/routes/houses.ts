import { Router } from 'express';
import { getHouses, getHouse } from '../controllers/houseController';

const router = Router();

router.get('/', getHouses);
router.get('/:houseName', getHouse);

export default router;