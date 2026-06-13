const jwt = require('jsonwebtoken');
const config = require('../../config/index');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.userId).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden: insufficient privileges' });
  }

  next();
};

module.exports = { authenticate, authorizeRoles };
