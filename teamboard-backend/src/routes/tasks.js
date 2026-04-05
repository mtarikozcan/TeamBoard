import { Router } from 'express';

const router = Router();

// GET /api/tasks/:id
router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// GET /api/tasks/:id/comments
router.get('/:id/comments', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// POST /api/tasks/:id/comments
router.post('/:id/comments', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

export default router;
