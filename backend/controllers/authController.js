const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.mongo'); // Mongoose model for MongoDB

// Register a new user
const register = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    // Check if the user already exists by username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already taken' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save(); // Save the user to the MongoDB database

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Error registering user:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login a user
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username }); // Query using Mongoose's findOne method
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role }, // Use MongoDB's _id field
      process.env.JWT_SECRET,
      { expiresIn: '2h' } // Token expires in 2 hours
    );

    // Return the token
    res.json({ token });
  } catch (err) {
    console.error('❌ Error logging in:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { register, login };
