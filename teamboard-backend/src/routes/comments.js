import { Router } from 'express';

const router = Router();

// DELETE /api/comments/:id
router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Henüz implement edilmedi.' });
});

export default router;
