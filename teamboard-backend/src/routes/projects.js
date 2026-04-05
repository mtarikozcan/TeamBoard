import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getProjects,
  getProject,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
  addMemberHandler,
  removeMemberHandler,
} from '../controllers/projectController.js';

const router = Router();

router.use(verifyToken);

// GET    /api/projects
router.get('/', getProjects);

// POST   /api/projects
router.post('/', createProjectHandler);

// GET    /api/projects/:id
router.get('/:id', getProject);

// PUT    /api/projects/:id
router.put('/:id', updateProjectHandler);

// DELETE /api/projects/:id
router.delete('/:id', deleteProjectHandler);

// POST   /api/projects/:id/members
router.post('/:id/members', addMemberHandler);

// DELETE /api/projects/:id/members/:userId
router.delete('/:id/members/:userId', removeMemberHandler);

export default router;
