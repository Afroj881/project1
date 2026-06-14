const ActivityLog = require('../models/ActivityLog');

async function activityLogger(req, res, next) {
  res.on('finish', async () => {
    try {
      const user = req.user ? req.user._id : null;
      await ActivityLog.create({ user, action: `${req.method} ${req.originalUrl}`, meta: { statusCode: res.statusCode } });
    } catch (e) {
      // ignore logging errors
    }
  });
  next();
}

module.exports = activityLogger;
