import { Router } from 'express';

const router = Router();

// GET /api/projects
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// POST /api/projects
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// GET /api/projects/:id
router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// PUT /api/projects/:id
router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// DELETE /api/projects/:id
router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// POST /api/projects/:id/members
router.post('/:id/members', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

// DELETE /api/projects/:id/members/:userId
router.delete('/:id/members/:userId', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

export default router;
