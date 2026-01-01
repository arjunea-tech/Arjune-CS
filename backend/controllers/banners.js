const Banner = require('../models/Banner');
const asyncHandler = require('../middleware/async');

// @desc    Get all banners
// @route   GET /api/v1/banners
// @access  Public
exports.getBanners = asyncHandler(async (req, res, next) => {
    const banners = await Banner.find();
    res.status(200).json({
        success: true,
        count: banners.length,
        data: banners
    });
});

// @desc    Create new banner
// @route   POST /api/v1/banners
// @access  Private/Admin
exports.createBanner = asyncHandler(async (req, res, next) => {
    if (req.file) {
        let image = req.file.path;
        if (!image.startsWith('http')) {
            image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        req.body.image = image;
    }

    const banner = await Banner.create(req.body);

    res.status(201).json({
        success: true,
        data: banner
    });
});

// @desc    Update banner
// @route   PUT /api/v1/banners/:id
// @access  Private/Admin
exports.updateBanner = asyncHandler(async (req, res, next) => {
    let banner = await Banner.findById(req.params.id);

    if (!banner) {
        return res.status(404).json({ success: false, error: 'Banner not found' });
    }

    if (req.file) {
        let image = req.file.path;
        if (!image.startsWith('http')) {
            image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        req.body.image = image;
    }

    banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: banner
    });
});

// @desc    Delete banner
// @route   DELETE /api/v1/banners/:id
// @access  Private/Admin
exports.deleteBanner = asyncHandler(async (req, res, next) => {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
        return res.status(404).json({ success: false, error: 'Banner not found' });
    }

    await banner.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});
