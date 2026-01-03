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
    // Handle multiple images if uploaded
    if (req.files && req.files.length > 0) {
        const images = req.files.map(file => {
            let url = file.path;
            if (!url.startsWith('http')) {
                url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            }
            return url;
        });
        req.body.images = images;
        req.body.image = images[0]; // Set first image as primary
    } else if (req.file) {
        // Fallback for single image upload
        let image = req.file.path;
        if (!image.startsWith('http')) {
            image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        req.body.image = image;
        req.body.images = [image];
    }

    const product = await Product.create(req.body);

    // Notify all users about the new product
    const { notifyAllUsers } = require('../utils/notifications');
    notifyAllUsers(
        'New Arrival! 🎆',
        `${product.name} is now available. Check it out!`,
        'promotion',
        { productId: product._id }
    );

    res.status(201).json({
        success: true,
        data: product
    });
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

    // Handle multiple images if uploaded
    if (req.files && req.files.length > 0) {
        const images = req.files.map(file => {
            let url = file.path;
            if (!url.startsWith('http')) {
                url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            }
            return url;
        });
        req.body.images = images;
        req.body.image = images[0]; // Set first image as primary
    } else if (req.file) {
        let image = req.file.path;
        if (!image.startsWith('http')) {
            image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        req.body.image = image;
        req.body.images = [image];
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
