const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find().populate('category', 'name');
    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
    // 1. Pick only text fields to ensure no junk image objects survive
    const { name, category, price, discountPrice, quantity, description, isFeatured, isDiwaliSpecial, pack, videoUrl, sku } = req.body;
    const cleanData = { name, category, price, discountPrice, quantity, description, isFeatured, isDiwaliSpecial, pack, videoUrl, sku };

    // --- Image Handling ---
    let finalImages = [];

    // 1. Add new uploaded images
    if (req.files && req.files.length > 0) {
        finalImages = req.files.map(file => {
            let url = file.path;
            if (!url.startsWith('http')) {
                url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            }
            return url;
        });
    }

    // 2. Add existing images if any (rare for create, but good for consistency)
    if (req.body.existingImages) {
        const existing = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
        finalImages = [...finalImages, ...existing];
    }

    if (finalImages.length > 0) {
        cleanData.images = finalImages;
        cleanData.image = finalImages[0];
    } else {
        cleanData.image = 'no-image.jpg';
        cleanData.images = ['no-image.jpg'];
    }

    // Sanitize data types
    if (cleanData.price) cleanData.price = Number(cleanData.price);
    if (cleanData.discountPrice) cleanData.discountPrice = Number(cleanData.discountPrice);
    if (cleanData.quantity) cleanData.quantity = Number(cleanData.quantity);

    // Handle boolean strings from FormData
    if (cleanData.isFeatured === 'true') cleanData.isFeatured = true;
    if (cleanData.isFeatured === 'false') cleanData.isFeatured = false;
    if (cleanData.isDiwaliSpecial === 'true') cleanData.isDiwaliSpecial = true;
    if (cleanData.isDiwaliSpecial === 'false') cleanData.isDiwaliSpecial = false;

    try {
        const product = await Product.create(cleanData);

        // Notify all users about the new product (Fire and forget, don't wait)
        try {
            const { notifyAllUsers } = require('../utils/notifications');
            notifyAllUsers(
                'New Arrival! 🎆',
                `${product.name} is now available. Check it out!`,
                'promotion',
                { productId: product._id }
            );
        } catch (notifErr) {
            console.error('[Create Product] Notification Error:', notifErr.message);
        }

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('[Create Product] DB Error:', error.message);
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message).join(', ');
            return res.status(400).json({ success: false, error: message });
        }
        next(error);
    }
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Capture old states for notifications
    const wasDiwaliSpecial = product.isDiwaliSpecial;
    const wasFeatured = product.isFeatured;

    // --- Image Handling ---
    let finalImages = [];

    // 1. Add existing images (if any were passed back)
    if (req.body.existingImages) {
        if (Array.isArray(req.body.existingImages)) {
            finalImages = [...req.body.existingImages];
        } else {
            finalImages = [req.body.existingImages];
        }
    }

    // 2. Add new uploaded images
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => {
            let url = file.path;
            if (!url.startsWith('http')) {
                url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            }
            return url;
        });
        finalImages = [...finalImages, ...newImages];
    } else if (req.file) {
        // Fallback for single file upload middleware usage
        let url = req.file.path;
        if (!url.startsWith('http')) {
            url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        finalImages.push(url);
    }

    // --- Construct Clean Update Data ---
    // Explicitly pick fields to avoid CastErrors from junk FormData
    const { name, category, price, discountPrice, quantity, description, pack, videoUrl, sku, status } = req.body;

    // Handle boolean strings from FormData
    let { isFeatured, isDiwaliSpecial } = req.body;
    if (isFeatured === 'true') isFeatured = true;
    if (isFeatured === 'false') isFeatured = false;
    if (isDiwaliSpecial === 'true') isDiwaliSpecial = true;
    if (isDiwaliSpecial === 'false') isDiwaliSpecial = false;

    const updateData = {
        name, category, price, discountPrice, quantity, description,
        pack, videoUrl, sku, status, isFeatured, isDiwaliSpecial
    };

    // Remove undefined fields (schema might default them otherwise, or we want to keep existing)
    // For findByIdAndUpdate, undefined values in object usually effectively ignore the field update, but safer to remove.
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // 3. Update images in updateData
    if (finalImages.length > 0 || req.body.existingImages) {
        updateData.images = finalImages;
        updateData.image = finalImages[0]; // Update primary image
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
    });

    // Check for status changes to trigger notifications
    const { notifyAllUsers } = require('../utils/notifications');

    // 1. New Diwali Special
    if (!wasDiwaliSpecial && product.isDiwaliSpecial) {
        notifyAllUsers(
            'Diwali Special Alert! 🕯️',
            `${product.name} is now a Diwali Special! Shop now for the best deals.`,
            'promotion',
            { productId: product._id }
        );
    }

    // 2. New Featured Product (only notify if not already notified as Diwali special to avoid spam)
    else if (!wasFeatured && product.isFeatured) {
        notifyAllUsers(
            'Featured Product! ⭐',
            `Check out our featured product: ${product.name}`,
            'promotion',
            { productId: product._id }
        );
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
