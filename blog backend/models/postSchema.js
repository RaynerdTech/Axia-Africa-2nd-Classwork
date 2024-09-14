const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Mark as required if necessary
        trim: true
    },
    desc: {
        type: String,
        required: true, // Mark as required if necessary
        trim: true
    },
    content: {
        type: String,
        required: true // Mark as required if necessary
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true // Mark as required if necessary
    },
    tags: {
        type: [String],
        default: []
    },
    previewPix: {
        type: String,
        default: ''
    },
    detailPix: {
        type: String,
        default: ''
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        type: [String],
        default: []
    },
    published: {
        type: Boolean,
        default: false
    },
    comment: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        type: [String],
        default: []
    },
}, { timestamps: true }); // This automatically adds `createdAt` and `updatedAt` fields

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
