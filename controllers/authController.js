// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.mongo');

// Register a new user
const register = async (req, res) => {
  const { username, password, email, role } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create a new user
    const user = await User.create({ username, password: hashedPassword, email, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Error registering user:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login a user
const login = async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare the password with the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' } // Token expires in 2 hours
  );

  // Return the token
  res.json({ token });
};

module.exports = { register, login };
