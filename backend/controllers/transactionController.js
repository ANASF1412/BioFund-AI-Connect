const Transaction = require('../models/Transaction');
const Project = require('../models/Project');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private (Admin or involved user)
const getTransactions = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Investor') {
            query.investorId = req.user._id;
        }
        const transactions = await Transaction.find(query)
            .populate('investorId', 'name email')
            .populate('projectId', 'title');
        sendSuccess(res, 200, 'Transactions retrieved', transactions);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Create a transaction (Fund project)
// @route   POST /api/transactions
// @access  Private/Investor
const createTransaction = async (req, res) => {
    try {
        const { projectId, amount } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return sendError(res, 404, 'Project not found');
        }
        if (project.status !== 'Approved') {
            return sendError(res, 400, 'Can only fund approved projects');
        }

        const transaction = new Transaction({
            investorId: req.user._id,
            projectId,
            amount,
        });

        const createdTransaction = await transaction.save();

        // Update project currentAmount
        project.currentAmount += Number(amount);
        await project.save();

        sendSuccess(res, 201, 'Transaction successful', createdTransaction);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

module.exports = {
    getTransactions,
    createTransaction,
};
