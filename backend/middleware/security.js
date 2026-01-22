const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Rate limiting middleware
exports.globalRateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    handler: (req, res) => {
        logger.warn('Rate limit exceeded', {
            ip: req.ip,
            path: req.path
        });
        res.status(429).json({
            success: false,
            error: 'Too many requests, please try again later'
        });
    },
    skip: (req) => process.env.NODE_ENV === 'development'
});

// Auth endpoints rate limiter (stricter)
exports.authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later',
    skipSuccessfulRequests: true
});

// API endpoints rate limiter (POST requests)
exports.postRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    skipSuccessfulRequests: false
});

// Security headers middleware
exports.securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", process.env.ALLOWED_ORIGINS?.split(',') || []],
        }
    },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// MongoDB Injection prevention
exports.mongoSanitization = (req, res, next) => {
    // Basic sanitization of req.body
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj.replace(/<[^>]*>/g, '').trim();
        }
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
            Object.keys(obj).forEach(key => {
                obj[key] = sanitize(obj[key]);
            });
        }
        return obj;
    };

    if (req.body) {
        req.body = sanitize(req.body);
    }
    next();
};

// Parameter pollution prevention
exports.parameterPollutionPrevention = hpp({
    whitelist: ['sort', 'fields', 'limit', 'page', 'search', 'category', 'price']
});

// CORS configuration
exports.corsConfig = {
    origin: (origin, callback) => {
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn('CORS rejected', { origin });
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Request validation middleware
exports.requestValidator = (req, res, next) => {
    const contentLength = req.get('content-length');
    const maxSize = parseInt(process.env.MAX_REQUEST_SIZE?.replace('mb', '') || '50') * 1024 * 1024;

    if (contentLength && parseInt(contentLength) > maxSize) {
        logger.warn('Request too large', {
            ip: req.ip,
            size: contentLength,
            max: maxSize
        });
        return res.status(413).json({
            success: false,
            error: `Request payload too large. Maximum size is ${process.env.MAX_REQUEST_SIZE || '50mb'}`
        });
    }

    next();
};

// Request timeout middleware
exports.requestTimeout = (req, res, next) => {
    const timeout = parseInt(process.env.REQUEST_TIMEOUT) || 30000; // 30 seconds
    req.setTimeout(timeout, () => {
        logger.error('Request timeout', {
            ip: req.ip,
            path: req.path,
            method: req.method,
            timeout: timeout
        });
        res.status(408).json({
            success: false,
            error: 'Request timeout'
        });
    });
    next();
};

// Logging middleware
exports.requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        };

        if (res.statusCode >= 400) {
            logger.error('HTTP Request', logData);
        } else if (res.statusCode >= 300) {
            logger.info('HTTP Request', logData);
        } else {
            logger.debug('HTTP Request', logData);
        }
    });

    next();
};

// Trust proxy
exports.trustProxy = (req, res, next) => {
    req.app.set('trust proxy', 1);
    next();
};
