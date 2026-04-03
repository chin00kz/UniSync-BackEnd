const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createModerator = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        let mod = await User.findOne({ email: 'moderator@sliit.lk' });
        if (!mod) {
            mod = await User.create({
                name: 'Mod Testing',
                email: 'moderator@sliit.lk',
                password: 'password123', // Will be hashed by pre-save
                role: 'moderator',
                sliitId: 'MOD001'
            });
            console.log('Moderator created:', mod.email);
        } else {
            console.log('Moderator already exists:', mod.email);
            mod.role = 'moderator';
            await mod.save();
            console.log('Updated role to moderator for testing');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createModerator();
