const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['QA_QUESTION', 'QA_ANSWER', 'PROJECT_UPDATE', 'FUNDING'],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            default: null,
        },
        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        read: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
