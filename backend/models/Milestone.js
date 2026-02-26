const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please add milestone title'],
        },
        description: {
            type: String,
            required: [true, 'Please add description'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        fundsReleased: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Milestone', milestoneSchema);
