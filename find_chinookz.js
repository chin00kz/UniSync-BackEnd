const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const findChinookz = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ name: 'Chinookz' });
        if (user) {
            console.log('--- FOUND CHINOOKZ ---');
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`ID: ${user._id}`);
        } else {
            console.log('Chinookz not found by name.');
            const all = await User.find({});
            console.log('--- ALL USERS ---');
            all.forEach(u => console.log(`${u.name} | ${u.role} | ${u.email}`));
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

findChinookz();
