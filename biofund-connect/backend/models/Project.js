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
        coordinates: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
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
        riskScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
        impactType: {
            type: String,
            enum: ['Forest', 'Wildlife', 'Water', 'Agriculture'],
            default: 'Forest'
        },
        ngoTrustScore: {
            type: Number,
            default: 5,
            min: 0,
            max: 10,
        },
        fundingCount: {
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
        },
        updates: [
            {
                message: String,
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true,
    }
);

// Auto-populate coordinates from location fields
projectSchema.pre('save', function (next) {
    if (this.location && this.location.latitude && this.location.longitude) {
        this.coordinates = {
            lat: this.location.latitude,
            lng: this.location.longitude
        };
    }
    next();
});

module.exports = mongoose.model('Project', projectSchema);
