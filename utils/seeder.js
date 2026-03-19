const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const seedAdmin = async () => {
    try {
        await User.deleteMany();

        const admin = {
            name: 'Chinookz',
            email: 'chinookz@gmail.com',
            password: '12345678',
            role: 'admin',
            sliitId: 'IT23194762',
            phone: '0710000000'
        };

        await User.create(admin);

        console.log('Admin data seeded successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
