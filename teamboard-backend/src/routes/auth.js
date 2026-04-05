import { Router } from 'express';

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

export default router;
