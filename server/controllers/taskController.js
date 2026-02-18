import TaskBlueprint from '../models/TaskBlueprint.js';

// Get all library tasks for the logged-in user
export const getTaskBlueprints = async (req, res) => {
  try {
    const tasks = await TaskBlueprint.find({ owner: req.user }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching library tasks', error: error.message });
  }
};

// Create a new reusable task
export const createTaskBlueprint = async (req, res) => {
  try {
    const { title, defaultDescription, color } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const newTask = await TaskBlueprint.create({
      owner: req.user,
      title,
      defaultDescription,
      color
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Delete a library task
export const deleteTaskBlueprint = async (req, res) => {
  try {
    const task = await TaskBlueprint.findOneAndDelete({ _id: req.params.id, owner: req.user });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }
    res.status(200).json({ message: 'Task removed from library', id: task._id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};


// Update a library task
export const updateTaskBlueprint = async (req, res) => {
  try {
    const task = await TaskBlueprint.findOneAndUpdate(
      { _id: req.params.id, owner: req.user },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};