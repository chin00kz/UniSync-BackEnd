const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const seedAdmin = async () => {
    try {
        const admin = {
            name: 'Chinookz',
            email: 'chinookz@sliit.lk',
            password: '12345678',
            role: 'admin',
            sliitId: 'IT23194762',
            phone: '0710000000'
        };

        let existingAdmin = await User.findOne({ email: admin.email }).select('+password');

        if (!existingAdmin) {
            await User.create(admin);
            console.log('Admin user created successfully');
        } else {
            existingAdmin.name = admin.name;
            existingAdmin.password = admin.password;
            existingAdmin.role = admin.role;
            existingAdmin.sliitId = admin.sliitId;
            existingAdmin.phone = admin.phone;
            existingAdmin.isBanned = false;
            existingAdmin.banReason = undefined;
            await existingAdmin.save();
            console.log('Admin user updated successfully');
        }

        console.log('Login email: chinookz@sliit.lk');
        console.log('Login password: 12345678');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
