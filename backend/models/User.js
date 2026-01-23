const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked', 'Inactive'],
        default: 'Active'
    },
    avatar: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    address: {
        type: String
    },
    pincode: {
        type: String
    },
    district: {
        type: String
    },
    state: {
        type: String
    },
    addresses: [
        {
            label: { type: String, default: 'Home' },
            address: { type: String, required: true },
            pincode: { type: String, required: true },
            district: { type: String, required: true },
            state: { type: String, required: true },
            isDefault: { type: Boolean, default: false }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpire: {
        type: Date,
        default: undefined
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: undefined
    },
    lastLogin: {
        type: Date,
        default: null
    }
});

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ role: 1 });

// Encrypt password using bcrypt
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
