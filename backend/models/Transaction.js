const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        investorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        amount: {
            type: Number,
            required: [true, 'Please add transaction amount'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Completed',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
