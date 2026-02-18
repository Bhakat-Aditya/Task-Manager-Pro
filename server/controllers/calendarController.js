import CalendarEntry from '../models/CalendarEntry.js';

// Get all calendar entries for a specific month/range
export const getCalendarEntries = async (req, res) => {
  try {
    // In a production app, we'd filter by start/end date queries. 
    // For now, we'll fetch all active entries for the user.
    const entries = await CalendarEntry.find({ owner: req.user })
      .populate('blueprintId', 'title color') // Pull the title from the library task
      .sort({ order: 1 });
      
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching calendar entries', error: error.message });
  }
};

// Add a task to a specific date (Fired on Drop)
export const createCalendarEntry = async (req, res) => {
  try {
    const { blueprintId, date, customDescription } = req.body;

    if (!date) return res.status(400).json({ message: 'Date is required' });

    // Count existing items on this date to set the display order
    const orderCount = await CalendarEntry.countDocuments({ owner: req.user, date });

    const newEntry = await CalendarEntry.create({
      owner: req.user,
      blueprintId,
      date,
      customDescription,
      order: orderCount
    });

    const populatedEntry = await newEntry.populate('blueprintId', 'title color');
    res.status(201).json(populatedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error placing task on calendar', error: error.message });
  }
};

// Update status (e.g., mark completed) or move to another date
export const updateCalendarEntry = async (req, res) => {
  try {
    const { status, date, order } = req.body;
    
    const entry = await CalendarEntry.findOneAndUpdate(
      { _id: req.params.id, owner: req.user },
      { $set: { status, date, order } },
      { new: true } // Return the updated document
    ).populate('blueprintId', 'title color');

    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating entry', error: error.message });
  }
};

// Remove a task from the calendar
export const deleteCalendarEntry = async (req, res) => {
  try {
    const entry = await CalendarEntry.findOneAndDelete({ _id: req.params.id, owner: req.user });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    
    res.status(200).json({ message: 'Entry removed', id: entry._id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry', error: error.message });
  }
};