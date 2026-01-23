const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String }, // Optional, helpful for UI
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    shippingAddress: {
        type: String, // Storing as simple string for now based on Checkout.jsx
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentResult: { // For UPI/Card responses
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    discountPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Requested',
        enum: ['Requested', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for better query performance
OrderSchema.index({ user: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ isPaid: 1 });
OrderSchema.index({ isDelivered: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);
