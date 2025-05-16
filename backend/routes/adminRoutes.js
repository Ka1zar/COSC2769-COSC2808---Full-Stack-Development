const express = require('express');
const router = express.Router();
const User = require('../models/User.mongo');
const Event = require('../models/Event.mongo');
const { authenticate, isAdmin } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const eventsByOrganizers = await Event.countDocuments({ createdByRole: 'organizer' }); // <-- Adjust based on schema

    const now = new Date();
    const upcomingEvents = await Event.countDocuments({ date: { $gte: now } });
    const pastEvents = await Event.countDocuments({ date: { $lt: now } });

    res.json({
      totalUsers,
      totalEvents,
      eventsByOrganizers,
      upcomingEvents,
      pastEvents,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics.' });
  }
});

module.exports = router;
