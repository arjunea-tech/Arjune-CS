const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Test users to create
const users = [
    {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        mobileNumber: '9876543210',
        address: '123 Admin Street, Admin City',
        pincode: '600001',
        district: 'Chennai',
        state: 'Tamil Nadu'
    },
    {
        name: 'Prakash',
        email: 'prakash@gmail.com',
        password: '12345678',
        role: 'customer',
        mobileNumber: '9988776655',
        address: '45 Customer Lane, Tech Park',
        pincode: '600002',
        district: 'Chennai',
        state: 'Tamil Nadu'
    },
    {
        name: 'Arjune',
        email: 'arjune@gmail.com',
        password: '87654321',
        role: 'customer',
        mobileNumber: '8877665544',
        address: '77 Developer Way, Code City',
        pincode: '600003',
        district: 'Chennai',
        state: 'Tamil Nadu'
    }
];

// Seed function
const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🌱 Connected to MongoDB...');

        // Clear existing data
        await User.deleteMany({});
        console.log('Emptying User collection...');

        // Insert new data
        // Using create() here to ensure model middleware (like password hashing) runs
        await User.create(users);

        console.log('✅ Database seeded successfully!');
        mongoose.connection.close(); // Graceful shutdown
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

// Run the seed function
seedUsers();
