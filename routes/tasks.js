const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const Credit = require('../models/Credit');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Создать задачу (для родителя)
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, description, credits, priority, dueDate } = req.body;
    const parentId = req.user.id;

    const task = new Task({
      title,
      description,
      credits: credits || 10,
      priority: priority || 'medium',
      parentId,
      dueDate
    });

    await task.save();
    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить все задачи для родителя
router.get('/parent-tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ parentId: req.user.id }).populate('childId');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить задачи для ребёнка
router.get('/child-tasks', authMiddleware, async (req, res) => {
  try {
    const child = await User.findById(req.user.id);
    const tasks = await Task.find({
      parentId: child.connectedParentId,
      status: 'pending'
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Выполнить задачу (для ребёнка)
router.post('/complete/:taskId', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const childId = req.user.id;

    // Находим задачу
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Обновляем статус задачи
    task.status = 'completed';
    task.completedAt = new Date();
    task.childId = childId;
    await task.save();

    // Добавляем кредиты ребёнку
    const child = await User.findById(childId);
    child.credits += task.credits;
    child.completedTasks += 1;
    await child.save();

    // Создаём запись о кредитах
    const credit = new Credit({
      childId,
      taskId,
      creditsEarned: task.credits,
      action: 'task_completed',
      reason: `Completed task: ${task.title}`
    });
    await credit.save();

    res.json({
      message: `Great! You earned ${task.credits} points!`,
      credits: child.credits,
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
