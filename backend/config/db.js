const mongoose = require('mongoose');
const logger = require('../utils/logger');

let retryCount = 0;
const MAX_RETRIES = 3;

const connectDB = async () => {
    try {
        const mongoOptions = {
            maxPoolSize: 10,
            minPoolSize: 5,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxIdleTimeMS: 60000,
            retryWrites: true,
            w: 'majority',
            connectTimeoutMS: 10000
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);
        
        retryCount = 0; // Reset retry count on successful connection
        
        logger.info('MongoDB Connected', {
            host: conn.connection.host,
            database: conn.connection.db.databaseName,
            readyState: conn.connection.readyState
        });

        // Connection event listeners
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error', { error: err.message });
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

        return conn;
    } catch (err) {
        logger.error('MongoDB connection failed', {
            error: err.message,
            uri: process.env.MONGO_URI?.replace(/:[^:@]*@/, ':****@'),
            attempt: retryCount + 1
        });
        
        // Only retry up to MAX_RETRIES times
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            logger.info(`Retrying MongoDB connection... (${retryCount}/${MAX_RETRIES})`);
            
            // Retry after 5 seconds
            setTimeout(() => {
                connectDB();
            }, 5000);
        } else {
            logger.error('Max MongoDB connection retries exceeded');
            // Don't exit - let app continue without DB
            // This allows frontend to work even if DB is temporarily unavailable
        }
    }
};

module.exports = connectDB;
