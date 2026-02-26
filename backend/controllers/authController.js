const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return sendError(res, 400, 'User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'Investor',
            status: 'pending'  // New users start as pending
        });

        if (user) {
            sendSuccess(res, 201, 'User registered successfully. Your account is waiting for admin approval.', {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                message: 'Your account is pending admin approval. You will be notified once approved.'
            });
        } else {
            sendError(res, 400, 'Invalid user data');
        }
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return sendError(res, 401, 'Invalid credentials');
        }

        // Check approval status
        if (user.status === 'pending') {
            return sendError(res, 403, 'Your account is pending admin approval. Please wait for approval notification.');
        }

        if (user.status === 'rejected') {
            return sendError(res, 403, `Your account has been rejected. Reason: ${user.approvalReason || 'No reason provided'}`);
        }

        // User is approved
        sendSuccess(res, 200, 'User logged in successfully', {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            token: generateToken(user._id),
        });
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        sendSuccess(res, 200, 'User data retrieved', req.user);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
