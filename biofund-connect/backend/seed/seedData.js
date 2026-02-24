const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const connectDB = require('../config/db');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });
// Also try backend .env if run from backend folder
dotenv.config();

connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();
        await Project.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('123456', salt);

        const users = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@test.com',
                password,
                role: 'Admin',
            },
            {
                name: 'Investor User',
                email: 'investor@test.com',
                password,
                role: 'Investor',
            },
            {
                name: 'NGO User',
                email: 'ngo@test.com',
                password,
                role: 'NGO',
            },
        ]);

        const ngoUser = users[2]._id;

        await Project.insertMany([
            {
                title: 'Save the Amazon',
                description: 'Planting trees in deforested areas of the Amazon.',
                location: { latitude: -3.4653, longitude: -62.2159 },
                goalAmount: 10000,
                currentAmount: 0,
                status: 'Approved',
                createdBy: ngoUser,
            },
            {
                title: 'Clean Ocean Initiative',
                description: 'Removing plastics from the Pacific Ocean.',
                location: { latitude: 0.0, longitude: -150.0 },
                goalAmount: 50000,
                currentAmount: 1500,
                status: 'Pending',
                createdBy: ngoUser,
            },
            {
                title: 'Renewable Energy for Schools',
                description: 'Installing solar panels in rural schools.',
                location: { latitude: 12.9716, longitude: 77.5946 },
                goalAmount: 20000,
                currentAmount: 20000,
                status: 'Completed',
                createdBy: ngoUser,
            },
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error.message}`);
        process.exit(1);
    }
};

seedData();
