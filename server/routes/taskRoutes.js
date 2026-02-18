import express from 'express';
import { getTaskBlueprints, createTaskBlueprint, deleteTaskBlueprint, updateTaskBlueprint } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getTaskBlueprints)
  .post(createTaskBlueprint);

router.route('/:id')
  .put(updateTaskBlueprint)
  .delete(deleteTaskBlueprint)

export default router;