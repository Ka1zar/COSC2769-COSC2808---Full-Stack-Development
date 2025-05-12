const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.mongo');

const router = express.Router();

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use.' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'attendee'
    });

    res.status(201).json({ message: 'User registered!', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, username, password } = req.body;
  const identifier = email || username; // Accept either field

  console.log('📥 Login attempt with:', identifier);

  try {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    });

    console.log('🔍 Found user:', user);  // Log user for debugging

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log('🔑 JWT token generated:', token);  // Log token for debugging

    res.status(200).json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('❌ Error logging in:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
