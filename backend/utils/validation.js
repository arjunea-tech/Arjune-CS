const { validationResult, body, param, query } = require('express-validator');
const logger = require('./logger');

// Validate request and handle errors
exports.validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(err => ({
            field: err.param,
            message: err.msg,
            value: err.value
        }));
        
        console.log('[VALIDATION] Errors:', JSON.stringify(errorDetails, null, 2));
        logger.warn('Validation error', {
            path: req.path,
            method: req.method,
            body: req.body,
            errors: errorDetails
        });
        
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errorDetails
        });
    }
    next();
};

// Common validators
exports.validators = {
    // Authentication validators
    register: [
        body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
        body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('mobileNumber')
            .if((value) => value && value.toString().trim().length > 0)
            .custom((value) => {
                if (value && !value.match(/^[0-9]{10}$/)) {
                    throw new Error('Valid mobile number must be 10 digits');
                }
                return true;
            })
            .optional({ checkFalsy: true }),
        body('address').trim().optional({ checkFalsy: true }),
        body('pincode')
            .if((value) => value && value.toString().trim().length > 0)
            .custom((value) => {
                if (value && !value.match(/^[0-9]{6}$/)) {
                    throw new Error('Pincode must be 6 digits');
                }
                return true;
            })
            .optional({ checkFalsy: true }),
        body('district').trim().optional({ checkFalsy: true }),
        body('state').trim().optional({ checkFalsy: true }),
        body('role').isIn(['customer', 'admin']).withMessage('Invalid role').optional()
    ],

    login: [
        body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required')
    ],

    // Product validators
    createProduct: [
        body('name').trim().notEmpty().withMessage('Product name is required').isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
        body('category').isMongoId().withMessage('Valid category ID is required'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('discountPrice').isFloat({ min: 0 }).optional(),
        body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative number'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('sku').trim().notEmpty().withMessage('SKU is required').isLength({ max: 50 }).withMessage('SKU must be max 50 characters')
    ],

    updateProduct: [
        param('id').isMongoId().withMessage('Valid product ID is required'),
        body('name').trim().optional().isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
        body('category').isMongoId().withMessage('Valid category ID is required').optional(),
        body('price').isFloat({ min: 0 }).optional().withMessage('Price must be a positive number'),
        body('discountPrice').isFloat({ min: 0 }).optional(),
        body('quantity').isInt({ min: 0 }).optional().withMessage('Quantity must be a non-negative number'),
        body('sku').trim().optional().isLength({ max: 50 }).withMessage('SKU must be max 50 characters')
    ],

    // Category validators
    createCategory: [
        body('name').trim().notEmpty().withMessage('Category name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
        body('description').trim().optional().isLength({ max: 500 }).withMessage('Description must be max 500 characters')
    ],

    // Banner validators
    createBanner: [
        body('title').trim().notEmpty().withMessage('Banner title is required'),
        body('description').trim().optional(),
        body('redirectUrl').isURL().optional().withMessage('Valid URL required'),
        body('isActive').isBoolean().optional()
    ],

    // Order validators
    createOrder: [
        body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
        body('items.*.productId').isMongoId().withMessage('Valid product ID is required'),
        body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
        body('shippingAddress.address').trim().notEmpty().withMessage('Shipping address is required'),
        body('shippingAddress.pincode').matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
        body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
        body('paymentMethod').isIn(['COD', 'UPI', 'CARD']).withMessage('Invalid payment method')
    ],

    // ID validators
    validateId: [
        param('id').isMongoId().withMessage('Valid ID is required')
    ]
};

// Sanitization middleware
exports.sanitizeInput = (req, res, next) => {
    // Remove any script tags or XSS attempts
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj.replace(/<[^>]*>/g, '').trim();
        }
        if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                obj[key] = sanitize(obj[key]);
            });
        }
        return obj;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);

    next();
};
