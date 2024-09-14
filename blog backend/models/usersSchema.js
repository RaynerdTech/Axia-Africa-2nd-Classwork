const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['User', 'Admin', 'SuperAdmin'], // Define the possible roles
        default: 'User' // Set default role
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields


userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
