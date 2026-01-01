const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    discountPrice: {
        type: Number
    },
    quantity: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    image: {
        type: String,
        default: 'no-image.jpg'
    },
    images: [
        {
            type: String
        }
    ],
    isFeatured: {
        type: Boolean,
        default: false
    },
    isDiwaliSpecial: {
        type: Boolean,
        default: false
    },
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    pack: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Out of Stock'],
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
