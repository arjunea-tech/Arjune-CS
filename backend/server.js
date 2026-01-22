const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Security middleware
const {
    securityHeaders,
    mongoSanitization,
    parameterPollutionPrevention,
    corsConfig,
    globalRateLimiter,
    requestValidator,
    requestTimeout,
    requestLogger,
    trustProxy
} = require('./middleware/security');

// Load env vars
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingVars = requiredEnvVars.filter(env => !process.env[env]);
if (missingVars.length > 0) {
    logger.error('Missing required environment variables', { missing: missingVars });
    process.exit(1);
}

// Connect to database
connectDB();

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Body parser with size limits - MUST COME FIRST
app.use(express.json({ limit: process.env.MAX_REQUEST_SIZE || '50mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.MAX_REQUEST_SIZE || '50mb' }));

// Security middleware
app.use(securityHeaders);
app.use(requestTimeout);
app.use(requestValidator);
app.use(trustProxy);

// Data sanitization
app.use(mongoSanitization);
app.use(parameterPollutionPrevention);

// CORS
app.use(cors(corsConfig));

// Logging
app.use(requestLogger);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
app.use(globalRateLimiter);

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route files
const categories = require('./routes/categories');
const products = require('./routes/products');
const banners = require('./routes/banners');
const auth = require('./routes/auth');
const orders = require('./routes/orders');
const users = require('./routes/users');
const chit = require('./routes/chit');
const notifications = require('./routes/notifications');

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API version info
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to CrackerShop API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Mount routers
app.use('/api/v1/notifications', notifications);
app.use('/api/v1/categories', categories);
app.use('/api/v1/products', products);
app.use('/api/v1/banners', banners);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/orders', orders);
app.use('/api/v1/chit', chit);

// 404 handler
app.use('*', (req, res) => {
    logger.warn('404 Not Found', {
        method: req.method,
        path: req.path,
        ip: req.ip
    });
    res.status(404).json({
        success: false,
        error: `Route ${req.path} not found`,
        method: req.method
    });
});

// Error handler middleware
const errorHandler = require('./middleware/error');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on ${HOST}:${PORT}`);
    logger.info(`Database: ${process.env.MONGO_URI.replace(/:[^:@]*@/, ':****@')}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
    logger.info(`${signal} received, starting graceful shutdown`);
    
    server.close(() => {
        logger.info('HTTP server closed');
        // Close database connection
        require('mongoose').connection.close().then(() => {
            logger.info('MongoDB connection closed');
            process.exit(0);
        }).catch(() => {
            process.exit(0);
        });
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections (don't shutdown for DB retry failures)
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection:', { 
        reason: reason?.message || reason,
        type: reason?.constructor?.name 
    });
    // Don't automatically shutdown - let app continue
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

module.exports = server;
