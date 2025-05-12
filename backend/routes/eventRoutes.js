const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); 
const Event = require('../models/Event.mongo');

// POST /api/events
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const image = req.file.path; // Cloudinary URL (stored in req.file.path)

    const event = new Event({ title, description, date, location, image });
    await event.save();

    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

module.exports = router;
