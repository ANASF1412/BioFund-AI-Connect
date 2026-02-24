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
        });

        if (user) {
            sendSuccess(res, 201, 'User registered successfully', {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
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

        if (user && (await user.matchPassword(password))) {
            sendSuccess(res, 200, 'User logged in successfully', {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            sendError(res, 401, 'Invalid credentials');
        }
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
