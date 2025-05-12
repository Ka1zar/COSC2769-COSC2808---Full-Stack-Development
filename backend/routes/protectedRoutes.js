// routes/protectedRoutes.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Protected route that only accessible with valid JWT
router.get('/admin-only', authenticate, (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

module.exports = router;
