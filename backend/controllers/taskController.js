const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, assignedTo, status } = req.body;
    const task = new Task({ title, description, deadline, assignedTo, status });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating task' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { search = '', status, sortBy = 'deadline' } = req.query;
    const query = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .sort({ [sortBy]: 1 });

    // Check if assignedTo user is active
    const tasksWithValidUsers = tasks.map(task => {
      if (!task.assignedTo || !task.assignedTo.isActive) {
        task.assignedTo = null; // Set to null if user is inactive or not found
      }
      return task;
    });

    res.json(tasksWithValidUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};


exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Check if assignedTo user is active
    if (!task.assignedTo || !task.assignedTo.isActive) {
      task.assignedTo = null; // Set to null if user is inactive or not found
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting task' });
  }
};
