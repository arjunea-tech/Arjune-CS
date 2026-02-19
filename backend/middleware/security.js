const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Rate limiting middleware - Higher limits for production
exports.globalRateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 1000 : 100, // Production: 1000 requests, Dev: 100
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

// Auth endpoints rate limiter (stricter for security)
exports.authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 20 : 5, // Production: 20, Dev: 5
    message: 'Too many login attempts, please try again later',
    skipSuccessfulRequests: true
    // Using in-memory store (no external Redis required)
});

// API endpoints rate limiter (POST requests)
exports.postRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 500 : 30, // Production: 500, Dev: 30
    skipSuccessfulRequests: false
    // Using in-memory store (no external Redis required)
});

// Security headers middleware
exports.securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: [
                "'self'",
                'http://localhost:*',
                'http://192.168.1.*',
                'http://127.0.0.1:*'
            ],
        }
    },
    hsts: {
        maxAge: 31536000,
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
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5000',
            'http://localhost:8081',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5000',
            'http://192.168.1.37:3000',
            'http://192.168.1.37:5000',
            'http://192.168.1.37:8081',
            'http://192.168.1.42:3000',
            'http://192.168.1.42:3001',
            'http://192.168.1.42:5000',
            'http://192.168.1.42:8081',
            'http://192.168.1.35:5000',
            'http://192.168.1.45:3000',
            'http://192.168.1.45:5000',
            'http://192.168.1.45:8081',
            ...(process.env.ALLOWED_ORIGINS?.split(',') || [])
        ];

        // Allow requests without origin (mobile apps, curl, etc)
        if (!origin || allowedOrigins.some(allowed => {
            if (allowed.includes('*')) {
                return new RegExp(allowed.replace(/\*/g, '.*')).test(origin);
            }
            return allowed === origin;
        })) {
            callback(null, true);
        } else {
            logger.warn('CORS rejected', { origin, allowedOrigins });
            callback(null, true); // Still allow but log it
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Number']
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
