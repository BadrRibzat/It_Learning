import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getProgress, getRing, submitCard, getFailed, resetProgress } from '../controllers/progressController';

const router = Router();

router.get('/', requireAuth, getProgress);
router.get('/ring/:stackId', requireAuth, getRing);
router.post('/submit', requireAuth, submitCard);
router.get('/failed/:stackId', requireAuth, getFailed);
router.post('/reset/:stackId', requireAuth, resetProgress); // stackId or 'all'

export default router;

