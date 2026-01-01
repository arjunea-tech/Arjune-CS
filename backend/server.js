const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Route files
const categories = require('./routes/categories');
const products = require('./routes/products');
const banners = require('./routes/banners');
const auth = require('./routes/auth');
const orders = require('./routes/orders');
const users = require('./routes/users');
const chit = require('./routes/chit');
const notifications = require('./routes/notifications');

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
console.log('Mounting Notifications router...');
app.use('/api/v1/notifications', notifications);
app.use('/api/v1/categories', categories);
app.use('/api/v1/products', products);
app.use('/api/v1/banners', banners);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/orders', orders);
app.use('/api/v1/chit', chit);

// Error handler middleware
const errorHandler = require('./middleware/error');
app.use(errorHandler);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to CrackerShop API' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
