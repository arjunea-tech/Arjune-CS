const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// @desc    Google login
// @route   POST /api/v1/auth/google
// @access  Public
exports.googleLogin = asyncHandler(async (req, res, next) => {
    const { idToken, accessToken } = req.body;

    let email, name, avatar;

    if (idToken) {
        // Verify ID Token (preferred)
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: [
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_ANDROID_CLIENT_ID,
                    process.env.GOOGLE_IOS_CLIENT_ID
                ].filter(Boolean)
            });
            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
            avatar = payload.picture;
        } catch (err) {
            console.error('[AUTH] Google ID Token verification failed:', err.message);
            return res.status(401).json({ success: false, error: 'Invalid Google ID token' });
        }
    } else if (accessToken) {
        // Fallback to Access Token (using UserInfo API)
        try {
            const response = await axios.get(
                `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
            );
            email = response.data.email;
            name = response.data.name;
            avatar = response.data.picture;
        } catch (err) {
            console.error('[AUTH] Google Access Token verification failed:', err.message);
            return res.status(401).json({ success: false, error: 'Invalid Google access token' });
        }
    } else {
        return res.status(400).json({ success: false, error: 'Please provide a Google token' });
    }

    if (!email) {
        return res.status(400).json({ success: false, error: 'Could not retrieve email from Google' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
        // Create new user if they don't exist
        user = await User.create({
            name: name || email.split('@')[0],
            email,
            password: Math.random().toString(36).slice(-10), // Random password for OAuth users
            avatar: avatar || '',
            role: 'customer',
            status: 'Active'
        });
        console.log('[AUTH] New user created via Google:', user.email);
    } else if (user.status === 'Blocked') {
        return res.status(403).json({ success: false, error: 'Your account has been blocked. Please contact admin.' });
    } else {
        console.log('[AUTH] User logged in via Google:', user.email);
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

// @desc    Forgot password - request password reset
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, error: 'Please provide email' });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    user.resetPasswordToken = require('crypto').createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await user.save();

    // In production, send email with reset link
    console.log(`[PASSWORD RESET] Token for ${email}: ${resetToken}`);

    res.status(200).json({
        success: true,
        message: 'Password reset link sent to email',
        token: resetToken // In production, this would only be sent via email
    });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetpassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { email, password, resetToken } = req.body;

    if (!email || !password || !resetToken) {
        return res.status(400).json({
            success: false,
            error: 'Please provide email, new password, and reset token'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            error: 'Password must be at least 6 characters'
        });
    }

    // Hash the token
    const hashedToken = require('crypto').createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
        email,
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            error: 'Invalid or expired reset token'
        });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password reset successful'
    });
});

// @desc    Change password (authenticated user)
// @route   PUT /api/v1/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            error: 'Please provide current password, new password, and confirm password'
        });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            error: 'New password and confirm password do not match'
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            error: 'New password must be at least 6 characters'
        });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    // Verify current password
    const isPasswordCorrect = await user.matchPassword(currentPassword);
    if (!isPasswordCorrect) {
        return res.status(401).json({
            success: false,
            error: 'Current password is incorrect'
        });
    }

    // Update to new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            data: user
        });
};
