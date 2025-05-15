// routes/protectedRoutes.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const { getTotalUsers, getUsersByRole, getNewUsersOverTime, getTotalEvents } = require('../controllers/statisticController');

// Protected route that only accessible with valid JWT
router.get('/admin-only', authenticate, (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

// User statistics endpoints (admin only)
router.get('/stats/users/total', authenticate, authorize('admin'), getTotalUsers);
router.get('/stats/users/by-role', authenticate, authorize('admin'), getUsersByRole);
router.get('/stats/users/new-over-time', authenticate, authorize('admin'), getNewUsersOverTime);

// Event statistics endpoints (admin only)
router.get('/stats/events/total', authenticate, authorize('admin'), getTotalEvents);

module.exports = router;
