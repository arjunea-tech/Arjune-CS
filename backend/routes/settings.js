const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
    getSettings,
    updateSettings,
    updateAboutUs,
    updateShipping,
    updateFees,
    getAboutUs,
    updateOrderSettings,
    getOrderSettings
} = require('../controllers/settings');

const router = express.Router();

// Public routes
router.get('/', getSettings);
router.get('/about-us', getAboutUs);
router.get('/order-settings', getOrderSettings);

// Admin routes
router.put('/', protect, authorize('admin'), updateSettings);
router.put('/about-us', protect, authorize('admin'), updateAboutUs);
router.put('/shipping', protect, authorize('admin'), updateShipping);
router.put('/fees', protect, authorize('admin'), updateFees);
router.put('/order-settings', protect, authorize('admin'), updateOrderSettings);

module.exports = router;
