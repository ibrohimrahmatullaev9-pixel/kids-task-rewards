const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Получить информацию о подключённых детях
router.get('/children', authMiddleware, async (req, res) => {
  try {
    const children = await User.find({ connectedParentId: req.user.id });
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить статистику ребёнка
router.get('/child-stats/:childId', authMiddleware, async (req, res) => {
  try {
    const child = await User.findById(req.params.childId);
    const completedTasks = await Task.countDocuments({
      childId: req.params.childId,
      status: 'completed'
    });
    const pendingTasks = await Task.countDocuments({
      parentId: req.user.id,
      status: 'pending'
    });

    res.json({
      childName: child.name,
      totalCredits: child.credits,
      completedTasks,
      pendingTasks,
      email: child.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Удалить задачу
router.delete('/task/:taskId', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: 'Task deleted', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
