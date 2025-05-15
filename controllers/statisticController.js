const User = require('../models/User.mongo');
const Event = require('../models/Event.mongo');

// User statistics controllers

// 1. Total number of users
const getTotalUsers = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ totalUsers: count });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching total users' });
    }
};

// 2. Number of users by role
const getUsersByRole = async (req, res) => {
    try {
        const roles = ['admin', 'organizer', 'attendee'];
        const counts = {};
        for (const role of roles) {
            counts[role] = await User.countDocuments({ role });
        }
        res.json({ usersByRole: counts });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users by role' });
    }
};

// 3. New users over time (by day)
const getNewUsersOverTime = async (req, res) => {
    try {
        // Group by date (YYYY-MM-DD)
        const data = await User.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json({ newUsersOverTime: data });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching new users over time' });
    }
};

// Event statistics controllers

// Get total number of events
const getTotalEvents = async (req, res) => {
    try {
        const count = await Event.countDocuments();
        res.json({ totalEvents: count });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching total events' });
    }
};

module.exports = {
    getTotalUsers,
    getUsersByRole,
    getNewUsersOverTime,
    getTotalEvents
};
