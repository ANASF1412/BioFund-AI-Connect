const Notification = require('../models/Notification');
const responseHandler = require('../utils/responseHandler');

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

        return responseHandler.success(res, {
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return responseHandler.error(res, 'Failed to fetch notifications', 500);
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
            return responseHandler.error(res, 'Notification not found', 404);
        }

        return responseHandler.success(res, { notification }, 'Notification marked as read');
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return responseHandler.error(res, 'Failed to mark notification as read', 500);
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { userId: req.user._id, read: false },
            { read: true }
        );

        return responseHandler.success(res, result, 'All notifications marked as read');
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return responseHandler.error(res, 'Failed to mark all notifications as read', 500);
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
            return responseHandler.error(res, 'Notification not found', 404);
        }

        return responseHandler.success(res, null, 'Notification deleted');
    } catch (error) {
        console.error('Error deleting notification:', error);
        return responseHandler.error(res, 'Failed to delete notification', 500);
    }
};
