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

module.exports = {
    getUsers,
};
