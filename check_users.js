const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkAllUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        console.log(`--- TOTAL USERS: ${users.length} ---`);
        users.forEach(u => console.log(`${u.name} (${u.role}) - ${u._id} - ${u.email}`));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAllUsers();
