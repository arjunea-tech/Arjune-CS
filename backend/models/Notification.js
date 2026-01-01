const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    type: {
        type: String,
        enum: ['order', 'chit', 'promotion', 'system'],
        default: 'system'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    data: {
        // Optional field for related IDs (e.g. orderId)
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);
