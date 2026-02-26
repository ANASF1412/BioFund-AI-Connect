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
                points: 5000,
                badges: ['Early Adopter', 'Earth Champion']
            },
            {
                name: 'Investor User',
                email: 'investor@test.com',
                password,
                role: 'Investor',
                points: 3500,
                badges: ['Early Adopter', 'Seed Planter']
            },
            {
                name: 'NGO User',
                email: 'ngo@test.com',
                password,
                role: 'NGO',
            },
            {
                name: 'Green Earth NGO',
                email: 'greenearth@ngo.com',
                password,
                role: 'NGO',
            },
            {
                name: 'Ocean Conservation Corp',
                email: 'oceancare@ngo.com',
                password,
                role: 'NGO',
            },
        ]);

        const ngoUser = users[2]._id;
        const ngoUser2 = users[3]._id;
        const ngoUser3 = users[4]._id;

        const projects = [
            // FOREST PROJECTS - Approved
            {
                title: 'Save the Amazon',
                description: 'Planting trees in deforested areas of the Amazon. Restoring biodiversity and combating climate change through large-scale reforestation.',
                category: 'Forest',
                impactType: 'Forest',
                location: { latitude: -3.4653, longitude: -62.2159, name: 'Amazon Rainforest, Brazil' },
                coordinates: { lat: -3.4653, lng: -62.2159 },
                goalAmount: 50000,
                currentAmount: 15000,
                fundingCount: 42,
                riskScore: 3,
                ngoTrustScore: 8,
                status: 'Approved',
                createdBy: ngoUser,
                impacts: {
                    treesPlanted: 50000,
                    waterSaved: 500000,
                    wildlifeSaved: 250
                },
                updates: [
                    { message: 'Phase 1 of reforestation completed - 25,000 trees planted' },
                    { message: 'Local communities engaged in conservation efforts' }
                ]
            },
            {
                title: 'Boreal Forest Protection',
                description: 'Protecting ancient boreal forests from logging. Preserving critical carbon sinks and wildlife habitats.',
                category: 'Forest',
                impactType: 'Forest',
                location: { latitude: 62.5, longitude: 25.0, name: 'Finland Boreal Forest' },
                coordinates: { lat: 62.5, lng: 25.0 },
                goalAmount: 35000,
                currentAmount: 32000,
                fundingCount: 28,
                riskScore: 2,
                ngoTrustScore: 9,
                status: 'Approved',
                createdBy: ngoUser2,
                impacts: {
                    treesPlanted: 0,
                    waterSaved: 1000000,
                    wildlifeSaved: 500
                }
            },
            {
                title: 'Reforestation in Southeast Asia',
                description: 'Large-scale tree planting and restoration of native forests across Indonesia and Malaysia.',
                category: 'Forest',
                impactType: 'Forest',
                location: { latitude: 0.5, longitude: 113.0, name: 'Borneo Rainforest' },
                coordinates: { lat: 0.5, lng: 113.0 },
                goalAmount: 45000,
                currentAmount: 22500,
                fundingCount: 35,
                riskScore: 5,
                ngoTrustScore: 7,
                status: 'Approved',
                createdBy: ngoUser3,
                impacts: {
                    treesPlanted: 75000,
                    waterSaved: 750000,
                    wildlifeSaved: 400
                }
            },
            
            // WILDLIFE PROJECTS - Approved
            {
                title: 'African Elephant Conservation',
                description: 'Protecting endangered elephants through anti-poaching patrols and habitat preservation in East Africa.',
                category: 'Wildlife',
                impactType: 'Wildlife',
                location: { latitude: -6.369, longitude: 34.888, name: 'Tanzania Wildlife Reserve' },
                coordinates: { lat: -6.369, lng: 34.888 },
                goalAmount: 60000,
                currentAmount: 45000,
                fundingCount: 52,
                riskScore: 6,
                ngoTrustScore: 8,
                status: 'Approved',
                createdBy: ngoUser,
                impacts: {
                    treesPlanted: 10000,
                    waterSaved: 200000,
                    wildlifeSaved: 150
                }
            },
            {
                title: 'Polar Bear Research & Protection',
                description: 'Research initiative to study and protect polar bears affected by climate change in the Arctic.',
                category: 'Wildlife',
                impactType: 'Wildlife',
                location: { latitude: 70.0, longitude: -95.0, name: 'Arctic Circle, Canada' },
                coordinates: { lat: 70.0, lng: -95.0 },
                goalAmount: 80000,
                currentAmount: 65000,
                fundingCount: 48,
                riskScore: 4,
                ngoTrustScore: 9,
                status: 'Approved',
                createdBy: ngoUser2,
                impacts: {
                    treesPlanted: 5000,
                    waterSaved: 100000,
                    wildlifeSaved: 80
                }
            },
            {
                title: 'Coral Reef Restoration',
                description: 'Restoring damaged coral ecosystems through artificial reef creation and marine protected areas.',
                category: 'Wildlife',
                impactType: 'Wildlife',
                location: { latitude: -16.269, longitude: 145.778, name: 'Great Barrier Reef, Australia' },
                coordinates: { lat: -16.269, lng: 145.778 },
                goalAmount: 75000,
                currentAmount: 30000,
                fundingCount: 38,
                riskScore: 5,
                ngoTrustScore: 8,
                status: 'Approved',
                createdBy: ngoUser3,
                impacts: {
                    treesPlanted: 0,
                    waterSaved: 5000000,
                    wildlifeSaved: 1000
                }
            },
            
            // WATER PROJECTS - Approved
            {
                title: 'Clean Ocean Initiative',
                description: 'Removing plastics and pollutants from the Pacific Ocean. Research and cleanup operations.',
                category: 'Water',
                impactType: 'Water',
                location: { latitude: 0.0, longitude: -150.0, name: 'Pacific Ocean' },
                coordinates: { lat: 0.0, lng: -150.0 },
                goalAmount: 90000,
                currentAmount: 55000,
                fundingCount: 64,
                riskScore: 7,
                ngoTrustScore: 7,
                status: 'Approved',
                createdBy: ngoUser,
                impacts: {
                    treesPlanted: 0,
                    waterSaved: 10000000,
                    wildlifeSaved: 5000
                }
            },
            {
                title: 'River Restoration Project',
                description: 'Cleaning and restoring rivers polluted by industrial waste. Wildlife habitat rehabilitation.',
                category: 'Water',
                impactType: 'Water',
                location: { latitude: 35.6762, longitude: 139.6503, name: 'Japan River System' },
                coordinates: { lat: 35.6762, lng: 139.6503 },
                goalAmount: 40000,
                currentAmount: 24000,
                fundingCount: 31,
                riskScore: 3,
                ngoTrustScore: 8,
                status: 'Approved',
                createdBy: ngoUser2,
                impacts: {
                    treesPlanted: 20000,
                    waterSaved: 2000000,
                    wildlifeSaved: 300
                }
            },
            {
                title: 'Wetland Conservation',
                description: 'Protecting and restoring critical wetland ecosystems that serve as water filters and wildlife habitats.',
                category: 'Water',
                impactType: 'Water',
                location: { latitude: 52.0, longitude: 5.0, name: 'Netherlands Wetlands' },
                coordinates: { lat: 52.0, lng: 5.0 },
                goalAmount: 35000,
                currentAmount: 28000,
                fundingCount: 25,
                riskScore: 2,
                ngoTrustScore: 9,
                status: 'Approved',
                createdBy: ngoUser3,
                impacts: {
                    treesPlanted: 15000,
                    waterSaved: 3000000,
                    wildlifeSaved: 500
                }
            },
            
            // AGRICULTURE PROJECTS - Approved
            {
                title: 'Sustainable Farming Initiative',
                description: 'Promoting organic and regenerative agriculture practices to improve soil health and reduce chemical pollution.',
                category: 'Agriculture',
                impactType: 'Agriculture',
                location: { latitude: 28.6139, longitude: 77.2090, name: 'India Agricultural Regions' },
                coordinates: { lat: 28.6139, lng: 77.2090 },
                goalAmount: 30000,
                currentAmount: 18000,
                fundingCount: 22,
                riskScore: 3,
                ngoTrustScore: 7,
                status: 'Approved',
                createdBy: ngoUser,
                impacts: {
                    treesPlanted: 30000,
                    waterSaved: 500000,
                    wildlifeSaved: 100
                }
            },
            {
                title: 'Agroforestry Development',
                description: 'Integrating trees with agricultural crops to improve yields, soil quality, and biodiversity.',
                category: 'Agriculture',
                impactType: 'Agriculture',
                location: { latitude: -1.9536, longitude: 29.8739, name: 'Uganda Farms' },
                coordinates: { lat: -1.9536, lng: 29.8739 },
                goalAmount: 25000,
                currentAmount: 15000,
                fundingCount: 18,
                riskScore: 4,
                ngoTrustScore: 8,
                status: 'Approved',
                createdBy: ngoUser2,
                impacts: {
                    treesPlanted: 40000,
                    waterSaved: 400000,
                    wildlifeSaved: 150
                }
            },
            
            // PENDING PROJECTS (waiting approval)
            {
                title: 'Rainforest Tech Monitoring',
                description: 'Using AI and satellite technology to monitor and protect rainforests in real-time.',
                category: 'Forest',
                impactType: 'Forest',
                location: { latitude: 9.1450, longitude: -79.5200, name: 'Panama Rainforest' },
                coordinates: { lat: 9.1450, lng: -79.5200 },
                goalAmount: 55000,
                currentAmount: 5000,
                fundingCount: 8,
                riskScore: 6,
                ngoTrustScore: 6,
                status: 'Pending',
                createdBy: ngoUser3,
                impacts: {
                    treesPlanted: 10000,
                    waterSaved: 300000,
                    wildlifeSaved: 200
                }
            },
            {
                title: 'Mangrove Forest Expansion',
                description: 'Planting and protecting mangrove forests to combat coastal erosion and provide wildlife habitat.',
                category: 'Water',
                impactType: 'Water',
                location: { latitude: 21.5922, longitude: 71.3244, name: 'India Coastal Areas' },
                coordinates: { lat: 21.5922, lng: 71.3244 },
                goalAmount: 45000,
                currentAmount: 8000,
                fundingCount: 12,
                riskScore: 5,
                ngoTrustScore: 7,
                status: 'Pending',
                createdBy: ngoUser,
                impacts: {
                    treesPlanted: 25000,
                    waterSaved: 1500000,
                    wildlifeSaved: 300
                }
            },
            {
                title: 'Desert Greening Project',
                description: 'Transforming desert areas into green zones through innovative irrigation and tree planting.',
                category: 'Agriculture',
                impactType: 'Agriculture',
                location: { latitude: 15.5527, longitude: 32.5892, name: 'Sudan Desert' },
                coordinates: { lat: 15.5527, lng: 32.5892 },
                goalAmount: 70000,
                currentAmount: 10000,
                fundingCount: 15,
                riskScore: 7,
                ngoTrustScore: 5,
                status: 'Pending',
                createdBy: ngoUser2,
                impacts: {
                    treesPlanted: 100000,
                    waterSaved: 2000000,
                    wildlifeSaved: 400
                }
            },
            
            // COMPLETED PROJECTS
            {
                title: 'Renewable Energy for Schools',
                description: 'Successfully installed solar panels in 50 rural schools across three continents.',
                category: 'Agriculture',
                impactType: 'Agriculture',
                location: { latitude: 12.9716, longitude: 77.5946, name: 'New Delhi, India' },
                coordinates: { lat: 12.9716, lng: 77.5946 },
                goalAmount: 20000,
                currentAmount: 20000,
                fundingCount: 35,
                riskScore: 1,
                ngoTrustScore: 10,
                status: 'Completed',
                createdBy: ngoUser3,
                impacts: {
                    treesPlanted: 5000,
                    waterSaved: 100000,
                    wildlifeSaved: 50
                }
            },
            {
                title: 'Community Water Well Project',
                description: 'Completed construction of 20 water wells providing clean water to remote communities.',
                category: 'Water',
                impactType: 'Water',
                location: { latitude: 9.0820, longitude: 8.6753, name: 'Nigeria Water Systems' },
                coordinates: { lat: 9.0820, lng: 8.6753 },
                goalAmount: 15000,
                currentAmount: 15000,
                fundingCount: 42,
                riskScore: 2,
                ngoTrustScore: 9,
                status: 'Completed',
                createdBy: ngoUser,
                impacts: {
                    treesPlanted: 8000,
                    waterSaved: 500000,
                    wildlifeSaved: 75
                }
            },
        ];

        await Project.insertMany(projects);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error.message}`);
        process.exit(1);
    }
};

seedData();
