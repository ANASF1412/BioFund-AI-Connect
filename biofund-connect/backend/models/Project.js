const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a project title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        category: {
            type: String,
            enum: ['Forest', 'Wildlife', 'Water', 'Agriculture'],
            default: 'Forest'
        },
        location: {
            latitude: {
                type: Number,
                required: true,
            },
            longitude: {
                type: Number,
                required: true,
            },
            name: {
                type: String,
                default: 'Global location'
            }
        },
        goalAmount: {
            type: Number,
            required: [true, 'Please add a goal amount'],
        },
        currentAmount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
            default: 'Pending',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        impacts: {
            treesPlanted: { type: Number, default: 0 },
            waterSaved: { type: Number, default: 0 }, // in gallons
            wildlifeSaved: { type: Number, default: 0 } // individuals
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Project', projectSchema);
