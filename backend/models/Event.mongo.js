// models/Event.mongo.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  image: { type: String } // This will store the Cloudinary image URL
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
