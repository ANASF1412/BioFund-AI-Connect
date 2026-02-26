const mongoose = require('mongoose');

const fundingSchema = new mongoose.Schema(
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
            required: [true, 'Please provide a funding amount'],
            min: [0.01, 'Amount must be greater than 0'],
        },
        status: {
            type: String,
            enum: ['Active', 'Completed', 'Cancelled'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate funding records
fundingSchema.index({ investorId: 1, projectId: 1 });

module.exports = mongoose.model('Funding', fundingSchema);
