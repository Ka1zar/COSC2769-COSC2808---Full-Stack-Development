require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Database connection (MongoDB)
require('./config/db.mongo');

app.use(cors({
  origin: 'http://localhost:5173', // Allow Vite frontend
  credentials: true                // Allow cookies or headers if needed
}));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing form-data if needed

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
