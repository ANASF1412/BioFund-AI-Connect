const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Protect all notification routes
router.use(protect);

// Get all notifications for logged-in user
router.get('/', notificationController.getNotifications);

// Mark single notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

// Delete notification (optional)
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
