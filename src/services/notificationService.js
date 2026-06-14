const Notification = require('../models/Notification');

const createNotification = async ({ user_id, type, message, link }) => {
  return Notification.create({ user_id, type, message, link: link || '' });
};

const getNotificationsForUser = async (userId, skip, limit) => {
  const [total, notifications] = await Promise.all([
    Notification.countDocuments({ user_id: userId }),
    Notification.find({ user_id: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
  ]);
  return { total, notifications };
};

const markAllRead = async (userId) => {
  return Notification.updateMany({ user_id: userId, isRead: false }, { isRead: true });
};

const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ user_id: userId, isRead: false });
};

module.exports = { createNotification, getNotificationsForUser, markAllRead, getUnreadCount };
