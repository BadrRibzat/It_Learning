
import { Router } from 'express';
import { getStacks, getStackCards, validateAnswer } from '../controllers/flashcardController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/stacks', requireAuth, getStacks);
router.get('/stacks/:stackId', requireAuth, getStackCards); // ?mode=flashcard|qa&offset=0&limit=50
router.post('/validate', requireAuth, validateAnswer);

export default router;


