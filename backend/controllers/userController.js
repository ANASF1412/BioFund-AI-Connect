const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        sendSuccess(res, 200, 'Users retrieved', users);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Get pending users (Admin only)
// @route   GET /api/users/pending
// @access  Private/Admin
const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ status: 'pending' });
        sendSuccess(res, 200, 'Pending users retrieved', users);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Approve user (Admin only)
// @route   PUT /api/users/approve/:userId
// @access  Private/Admin
const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        if (user.status === 'approved') {
            return sendError(res, 400, 'User is already approved');
        }

        user.status = 'approved';
        user.approvedBy = req.user._id;
        user.approvedAt = new Date();
        await user.save();

        // Create notification for user
        const Notification = require('../models/Notification');
        await Notification.create({
            userId: user._id,
            message: `Your BioFund Connect account has been approved! You can now login and start exploring.`,
            type: 'FUNDING',
            read: false
        });

        sendSuccess(res, 200, 'User approved successfully', user);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Reject user (Admin only)
// @route   PUT /api/users/reject/:userId
// @access  Private/Admin
const rejectUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        if (user.status === 'rejected') {
            return sendError(res, 400, 'User is already rejected');
        }

        user.status = 'rejected';
        user.approvedBy = req.user._id;
        user.approvedAt = new Date();
        user.approvalReason = reason || 'Application did not meet requirements';
        await user.save();

        // Create notification for user
        const Notification = require('../models/Notification');
        await Notification.create({
            userId: user._id,
            message: `Your application to join BioFund Connect was not approved. Reason: ${user.approvalReason}`,
            type: 'FUNDING',
            read: false
        });

        sendSuccess(res, 200, 'User rejected successfully', user);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

module.exports = {
    getUsers,
    getPendingUsers,
    approveUser,
    rejectUser,
};
