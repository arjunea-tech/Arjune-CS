const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ success: false, error: 'Request body is missing. Ensure you are sending multipart/form-data correctly.' });
    }

    const {
        name,
        email,
        password,
        role,
        mobileNumber,
        address,
        pincode,
        district,
        state
    } = req.body;

    let avatar = '';
    if (req.file) {
        avatar = req.file.path;
        // If using local storage, construct full URL
        if (!avatar.startsWith('http')) {
            avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role,
        avatar,
        mobileNumber,
        address,
        pincode,
        district,
        state
    });

    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate emial & password
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        address: req.body.address,
        pincode: req.body.pincode,
        district: req.body.district,
        state: req.body.state
    };

    if (req.file) {
        let avatar = req.file.path;
        // If using local storage, construct full URL
        if (!avatar.startsWith('http')) {
            avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        fieldsToUpdate.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    // req.user is already populated by protect middleware
    res.status(200).json({
        success: true,
        data: req.user
    });
});

// @desc    Add new address
// @route   POST /api/v1/auth/addresses
// @access  Private
exports.addAddress = asyncHandler(async (req, res, next) => {
    console.log('Add Address Request Body:', req.body);

    if (!req.body || !req.body.address) {
        return res.status(400).json({ success: false, error: 'Please provide address details' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $push: { addresses: req.body } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user.addresses
        });
    } catch (error) {
        console.error('Add Address Error:', error);
        res.status(error.name === 'ValidationError' ? 400 : 500).json({
            success: false,
            error: error.message || 'Error saving address'
        });
    }
});

// @desc    Set default address
// @route   PUT /api/v1/auth/addresses/:id/default
// @access  Private
exports.setDefaultAddress = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Set all to false, then target to true
        user.addresses = user.addresses.map(addr => ({
            ...addr.toObject(),
            isDefault: addr._id.toString() === req.params.id
        }));

        await user.save();

        res.status(200).json({
            success: true,
            data: user.addresses
        });
    } catch (error) {
        console.error('Set Default Address Error:', error);
        res.status(400).json({ success: false, error: error.message || 'Error setting default address' });
    }
});

// @desc    Delete address
// @route   DELETE /api/v1/auth/addresses/:id
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { addresses: { _id: req.params.id } } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user.addresses
        });
    } catch (error) {
        console.error('Delete Address Error:', error);
        res.status(400).json({ success: false, error: error.message || 'Error deleting address' });
    }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        data: user
    });
};
