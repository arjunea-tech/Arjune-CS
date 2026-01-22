const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    console.log('[AUTH] Register request body:', Object.keys(req.body));
    
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ 
            success: false, 
            error: 'Request body is empty. Please send name, email, and password.' 
        });
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

    // Validate required fields
    if (!name || !email || !password) {
        console.log('[AUTH] Missing required fields:', { hasName: !!name, hasEmail: !!email, hasPassword: !!password });
        return res.status(400).json({ 
            success: false, 
            error: 'Please provide name, email, and password',
            details: [
                !name && { field: 'name', message: 'Name is required' },
                !email && { field: 'email', message: 'Email is required' },
                !password && { field: 'password', message: 'Password is required' }
            ].filter(Boolean)
        });
    }

    let avatar = '';
    if (req.file) {
        avatar = req.file.path;
        // If using local storage, construct full URL
        if (!avatar.startsWith('http')) {
            avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        console.log('[AUTH] User already exists:', email);
        return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    try {
        // Create user with only provided fields
        const userData = {
            name,
            email,
            password,
            role: role || 'customer',
            avatar
        };

        // Add optional fields if provided and not empty
        if (mobileNumber && mobileNumber.trim()) userData.mobileNumber = mobileNumber;
        if (address && address.trim()) userData.address = address;
        if (pincode && pincode.trim()) userData.pincode = pincode;
        if (district && district.trim()) userData.district = district;
        if (state && state.trim()) userData.state = state;

        console.log('[AUTH] Creating user with data:', { name, email, role: userData.role });
        
        const user = await User.create(userData);
        console.log('[AUTH] User created successfully:', user._id);
        
        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error('[AUTH] Registration error:', error.message);
        return res.status(400).json({ 
            success: false, 
            error: error.message || 'Registration failed' 
        });
    }
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

    // Check if user is blocked
    if (user.status === 'Blocked') {
        return res.status(403).json({ success: false, error: 'Your account has been blocked. Please contact admin.' });
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

// @desc    Reset password
// @route   POST /api/v1/auth/resetpassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide email and new password' });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found with this email' });
    }

    // Update password
    user.password = password;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password reset successful'
    });
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
