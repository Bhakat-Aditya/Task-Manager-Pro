import express from 'express';
import { getCalendarEntries, createCalendarEntry, updateCalendarEntry, deleteCalendarEntry } from '../controllers/calendarController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCalendarEntries)
  .post(createCalendarEntry);

router.route('/:id')
  .put(updateCalendarEntry)
  .delete(deleteCalendarEntry);

export default router;