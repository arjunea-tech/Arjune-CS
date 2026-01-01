const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const cleanIndexes = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        try {
            // Get all indexes
            const indexes = await mongoose.connection.db.collection('products').indexes();
            console.log('Found Indexes:', indexes.map(i => i.name));

            // Drop all indexes except _id_
            // We can simplify by just dropping the specific unique ones if we know them, 
            // but dropping all ensures a clean slate for the schema to rebuild them.
            // Note: dropIndexes() drops all except _id_
            await mongoose.connection.db.collection('products').dropIndexes();
            console.log('SUCCESS: All indexes dropped on "products" collection. They will recreate automatically on next app start.');

        } catch (error) {
            console.log('Index Drop Error:', error.message);
        }

        process.exit();
    } catch (error) {
        console.error('Connection Error:', error);
        process.exit(1);
    }
};

cleanIndexes();
