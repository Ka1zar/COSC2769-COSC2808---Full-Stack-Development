const Event = require('../models/Event.mongo');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const imageUrl = req.file ? req.file.path : null;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      image: imageUrl
    });

    await newEvent.save();

    res.status(201).json({ message: 'Event created', event: newEvent });
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};
