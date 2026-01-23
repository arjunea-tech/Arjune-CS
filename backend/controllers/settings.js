const Settings = require('../models/Settings');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all settings
// @route   GET /api/v1/settings
// @access  Public
exports.getSettings = asyncHandler(async (req, res, next) => {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default ones
    if (!settings) {
        settings = await Settings.create({});
    }

    res.status(200).json({
        success: true,
        data: settings
    });
});

// @desc    Update settings
// @route   PUT /api/v1/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res, next) => {
    const { aboutUs, shipping, fees, orderSettings, contact } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    if (aboutUs) settings.aboutUs = { ...settings.aboutUs, ...aboutUs };
    if (shipping) settings.shipping = { ...settings.shipping, ...shipping };
    if (fees) settings.fees = { ...settings.fees, ...fees };
    if (orderSettings) settings.orderSettings = { ...settings.orderSettings, ...orderSettings };
    if (contact) settings.contact = { ...settings.contact, ...contact };

    await settings.save();

    res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: settings
    });
});

// @desc    Update About Us
// @route   PUT /api/v1/settings/about-us
// @access  Private/Admin
exports.updateAboutUs = asyncHandler(async (req, res, next) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    settings.aboutUs = { ...settings.aboutUs, ...req.body };
    await settings.save();

    res.status(200).json({
        success: true,
        message: 'About Us updated successfully',
        data: settings.aboutUs
    });
});

// @desc    Update Shipping Details
// @route   PUT /api/v1/settings/shipping
// @access  Private/Admin
exports.updateShipping = asyncHandler(async (req, res, next) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    settings.shipping = { ...settings.shipping, ...req.body };
    await settings.save();

    res.status(200).json({
        success: true,
        message: 'Shipping details updated successfully',
        data: settings.shipping
    });
});

// @desc    Update Fees
// @route   PUT /api/v1/settings/fees
// @access  Private/Admin
exports.updateFees = asyncHandler(async (req, res, next) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    settings.fees = { ...settings.fees, ...req.body };
    await settings.save();

    res.status(200).json({
        success: true,
        message: 'Fees updated successfully',
        data: settings.fees
    });
});

// @desc    Get About Us
// @route   GET /api/v1/settings/about-us
// @access  Public
exports.getAboutUs = asyncHandler(async (req, res, next) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    res.status(200).json({
        success: true,
        data: settings.aboutUs
    });
});

// @desc    Update Order Settings
// @route   PUT /api/v1/settings/order-settings
// @access  Private/Admin
exports.updateOrderSettings = asyncHandler(async (req, res, next) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    settings.orderSettings = { ...settings.orderSettings, ...req.body };
    await settings.save();

    res.status(200).json({
        success: true,
        message: 'Order settings updated successfully',
        data: settings.orderSettings
    });
});

// @desc    Get Order Settings
// @route   GET /api/v1/settings/order-settings
// @access  Public
exports.getOrderSettings = asyncHandler(async (req, res, next) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    res.status(200).json({
        success: true,
        data: settings.orderSettings
    });
});
