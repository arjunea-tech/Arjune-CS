const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const User = require('../models/User');
const logger = require('../utils/logger');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        logger.warn('Unauthorized access attempt', {
            path: req.path,
            ip: req.ip,
            method: req.method
        });
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            logger.warn('User not found for token', {
                userId: decoded.id,
                ip: req.ip
            });
            return res.status(401).json({
                success: false,
                error: 'User no longer exists'
            });
        }

        if (req.user.status === 'Blocked') {
            logger.warn('Blocked user access attempt', {
                userId: req.user._id,
                email: req.user.email,
                ip: req.ip
            });
            return res.status(403).json({
                success: false,
                error: 'Your account has been blocked. Please contact admin.'
            });
        }

        logger.debug('User authenticated', {
            userId: req.user._id,
            email: req.user.email
        });

        next();
    } catch (err) {
        logger.warn('Token verification failed', {
            error: err.message,
            ip: req.ip
        });
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            logger.warn('Unauthorized role access', {
                userId: req.user._id,
                userRole: req.user.role,
                requiredRoles: roles,
                path: req.path,
                ip: req.ip
            });
            return res.status(403).json({
                success: false,
                error: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        logger.debug('Authorization check passed', {
            userId: req.user._id,
            userRole: req.user.role,
            path: req.path
        });
        next();
    };
};

// Optional authentication - sets user if token exists
exports.optionalAuth = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
        } catch (err) {
            logger.debug('Optional auth token verification failed', {
                error: err.message
            });
        }
    }

    next();
});
