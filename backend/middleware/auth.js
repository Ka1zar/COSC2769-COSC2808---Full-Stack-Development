// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from the header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
    req.user = decoded;  // Add decoded user info to request object
    next();  // Continue to the next middleware/route
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { authenticate };
