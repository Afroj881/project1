const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createNotification, getMyNotifications, readAllNotifications, getUnreadCount } = require('../controllers/notificationController');

const router = express.Router();

router.post('/', authenticate, createNotification);
router.get('/my', authenticate, getMyNotifications);
router.put('/read-all', authenticate, readAllNotifications);
router.get('/unread-count', authenticate, getUnreadCount);

module.exports = router;
