const mongoose = require('mongoose');

const ChitPaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    scheme: {
        type: mongoose.Schema.ObjectId,
        ref: 'ChitScheme',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add payment amount']
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    monthIndex: {
        type: Number,
        required: true // 1 for 1st month, 2 for 2nd, etc.
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Failed'],
        default: 'Paid'
    }
});

module.exports = mongoose.model('ChitPayment', ChitPaymentSchema);
