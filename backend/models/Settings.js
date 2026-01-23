const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    // About Us Section
    aboutUs: {
        title: {
            type: String,
            default: 'About CrackerShop'
        },
        description: {
            type: String,
            default: ''
        },
        mission: {
            type: String,
            default: ''
        },
        vision: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: ''
        }
    },

    // Shipping & Fees
    shipping: {
        baseFee: {
            type: Number,
            default: 50
        },
        freeShippingAbove: {
            type: Number,
            default: 500
        },
        description: {
            type: String,
            default: 'Free shipping on orders above ₹500'
        }
    },

    // Additional Fees
    fees: {
        packagingFee: {
            type: Number,
            default: 0
        },
        handlingFee: {
            type: Number,
            default: 0
        },
        description: {
            type: String,
            default: ''
        }
    },

    // Order Settings
    orderSettings: {
        minimumOrderAmount: {
            type: Number,
            default: 100,
            min: 0
        },
        description: {
            type: String,
            default: 'Minimum order amount required'
        }
    },

    // Contact Info
    contact: {
        email: {
            type: String,
            default: 'support@crackershop.com'
        },
        phone: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        }
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
SettingsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Settings', SettingsSchema);
