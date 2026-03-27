const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@sliit\.lk$/, 'Please use a valid SLIIT email (@sliit.lk)']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator', 'superadmin', 'student', 'staff'],
        default: 'user'
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    banReason: {
        type: String,
        required: false
    },
    sliitId: {
        type: String,
        required: [true, 'Please add a SLIIT ID']
    },
    phone: {
        type: String,
        required: false
    },
    subject: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        default: 5.0
    },
    price: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        required: false
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
