const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ user_id, action, entityType, entityId, details }) => {
  return ActivityLog.create({ user_id, action, entityType, entityId, details });
};

module.exports = { logActivity };
