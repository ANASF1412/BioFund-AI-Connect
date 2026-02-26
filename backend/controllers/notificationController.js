const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Get all notifications for logged-in user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('fromUser', 'name avatar')
            .populate('relatedId')
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            userId: req.user._id,
            read: false,
        });

        return sendSuccess(res, 200, 'Notifications retrieved', {
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return sendError(res, 500, 'Failed to fetch notifications');
    }
};

// Mark single notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return sendError(res, 404, 'Notification not found');
        }

        return sendSuccess(res, 200, 'Notification marked as read', { notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return sendError(res, 500, 'Failed to mark notification as read');
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { userId: req.user._id, read: false },
            { read: true }
        );

        return sendSuccess(res, 200, 'All notifications marked as read', result);
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return sendError(res, 500, 'Failed to mark all notifications as read');
    }
};

// Internal function to create notification (called by other controllers)
exports.createNotification = async (userId, type, message, link = null, relatedId = null, fromUser = null) => {
    try {
        const notification = new Notification({
            userId,
            type,
            message,
            link,
            relatedId,
            fromUser,
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Delete notification (optional)
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOneAndDelete({
            _id: id,
            userId: req.user._id,
        });

        if (!notification) {
            return sendError(res, 404, 'Notification not found');
        }

        return sendSuccess(res, 200, 'Notification deleted', null);
    } catch (error) {
        console.error('Error deleting notification:', error);
        return sendError(res, 500, 'Failed to delete notification');
    }
};

