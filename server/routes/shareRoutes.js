import express from 'express';
import { createShareLink, getSharedCalendar } from '../controllers/shareController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate a link (Owner only)
router.post('/', protect, createShareLink);

// View a shared calendar (Public, token acts as the key)
router.get('/:token', getSharedCalendar);

export default router;