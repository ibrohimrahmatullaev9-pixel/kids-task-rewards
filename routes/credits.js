const express = require('express');
const User = require('../models/User');
const Credit = require('../models/Credit');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Получить баланс кредитов
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      credits: user.credits,
      completedTasks: user.completedTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// История кредитов
router.get('/history/:childId', authMiddleware, async (req, res) => {
  try {
    const credits = await Credit.find({ childId: req.params.childId })
      .populate('taskId')
      .sort({ createdAt: -1 });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Добавить бонус (для родителя)
router.post('/add-bonus', authMiddleware, async (req, res) => {
  try {
    const { childId, amount, reason } = req.body;

    const child = await User.findById(childId);
    child.credits += amount;
    await child.save();

    const credit = new Credit({
      childId,
      taskId: null,
      creditsEarned: amount,
      action: 'bonus',
      reason: reason || 'Bonus from parent'
    });
    await credit.save();

    res.json({
      message: `Bonus of ${amount} points added!`,
      credits: child.credits
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
