// models/User.mysql.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.mysql');

const User = sequelize.define('User', {
  username: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  role: { 
    type: DataTypes.ENUM('admin', 'organizer', 'attendee'), 
    defaultValue: 'attendee' 
  },
  email: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false 
  }
});

// Sync the model with the database (this will create the table)
User.sync()
  .then(() => console.log('✅ User model synced with MySQL database'))
  .catch((err) => console.error('❌ Error syncing User model:', err));

module.exports = User;
