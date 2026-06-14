const Notification = require('../models/Notification');
const { getPagination } = require('../utils/pagination');

const createNotification = async (req, res) => {
  const { user_id, type, message, link } = req.body;
  if (!user_id || !type || !message) {
    return res.status(400).json({ message: 'user_id, type, and message are required' });
  }
  const notification = await Notification.create({
    user_id,
    type,
    message,
    link: link || '',
  });
  res.status(201).json({ notification });
};

const getMyNotifications = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const total = await Notification.countDocuments({ user_id: req.user._id });
  const notifications = await Notification.find({ user_id: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  res.json({ total, page, limit, notifications });
};

const readAllNotifications = async (req, res) => {
  await Notification.updateMany({ user_id: req.user._id, isRead: false }, { isRead: true });
  res.json({ message: 'All notifications marked as read' });
};

const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({ user_id: req.user._id, isRead: false });
  res.json({ unreadCount: count });
};

module.exports = { createNotification, getMyNotifications, readAllNotifications, getUnreadCount };
