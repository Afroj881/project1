import logger from '../config/logger.js';

const activityLogger = (req, res, next) => {
  res.on('finish', () => {
    logger.info({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      user: req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : null,
      timestamp: new Date().toISOString()
    }, 'request completed');
  });
  next();
};

export default activityLogger;
