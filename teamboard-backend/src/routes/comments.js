import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { deleteCommentHandler } from '../controllers/commentController.js';

const router = Router();

// DELETE /api/comments/:id
router.delete('/:id', verifyToken, deleteCommentHandler);

export default router;
