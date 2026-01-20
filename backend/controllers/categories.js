const Category = require('../models/Category');
const asyncHandler = require('../middleware/async');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
    });
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.status(200).json({
        success: true,
        data: category
    });
});

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
    const { name, description, status } = req.body;
    const createData = { name, description, status };

    // Add image path if file uploaded
    if (req.file) {
        let image = req.file.path;
        if (!image.startsWith('http')) {
            image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        createData.image = image;
    }

    const category = await Category.create(createData);

    res.status(201).json({
        success: true,
        data: category
    });
});

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const { name, description, status } = req.body;
    const updateData = { name, description, status };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // Update image if new one uploaded
    if (req.file) {
        let image = req.file.path;
        if (!image.startsWith('http')) {
            image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        updateData.image = image;
    }

    category = await Category.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: category
    });
});

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({ success: false, error: 'Category not found' });
    }

    await category.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
