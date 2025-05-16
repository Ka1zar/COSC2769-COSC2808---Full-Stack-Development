const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Decoded contains things like { id, role, email }
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

// 👇 Admin-only middleware (requires authenticate to run first)
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { authenticate, isAdmin };
