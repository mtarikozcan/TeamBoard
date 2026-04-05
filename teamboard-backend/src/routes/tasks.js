import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getTask,
  updateTaskHandler,
  deleteTaskHandler,
} from '../controllers/taskController.js';
import {
  getComments,
  createCommentHandler,
} from '../controllers/commentController.js';

const router = Router();

router.use(verifyToken);

// GET    /api/tasks/:id
router.get('/:id', getTask);

// PUT    /api/tasks/:id
router.put('/:id', updateTaskHandler);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTaskHandler);

// GET    /api/tasks/:id/comments
router.get('/:id/comments', getComments);

// POST   /api/tasks/:id/comments
router.post('/:id/comments', createCommentHandler);

export default router;
