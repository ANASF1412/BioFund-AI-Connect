const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
            index: true,
        },
        referenceId: {
            type: String,
            unique: true,
            required: true,
        },
        esgScore: {
            overall: Number,
            environmental: Number,
            social: Number,
            governance: Number,
            label: String,
        },
        downloadCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ projectId: 1, userId: 1 });

module.exports = mongoose.model('Report', reportSchema);
