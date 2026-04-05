import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', verifyToken, getMe);

export default router;
