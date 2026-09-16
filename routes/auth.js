const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Проверяем есть ли уже пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Если родитель - генерируем код
    let parentCode = null;
    if (role === 'parent') {
      parentCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Создаём пользователя
    const user = new User({
      name,
      email,
      password,
      role,
      parentCode
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      parentCode: parentCode,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        parentCode: user.parentCode,
        credits: user.credits
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Подключить ребёнка к родителю по коду
router.post('/connect-child', async (req, res) => {
  try {
    const { childId, parentCode } = req.body;

    // Находим родителя по коду
    const parent = await User.findOne({ parentCode });
    if (!parent) {
      return res.status(400).json({ message: 'Invalid parent code' });
    }

    // Обновляем ребёнка
    const child = await User.findByIdAndUpdate(
      childId,
      { connectedParentId: parent._id },
      { new: true }
    );

    res.json({
      message: 'Child connected to parent successfully',
      child
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
