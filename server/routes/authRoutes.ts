// routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, verifyEmail, logoutUser } from '../controllers/authController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);
router.post('/logout', logoutUser);

export default router;
