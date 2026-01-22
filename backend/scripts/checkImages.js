const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const checkImages = async () => {
    try {
        await connectDB();

        const products = await Product.find().limit(5).select('name image images');
        console.log('--- Sample Products ---');
        products.forEach(p => console.log(`${p.name}: image=${p.image}, images=${JSON.stringify(p.images)}`));

        const categories = await Category.find().limit(5).select('name image');
        console.log('--- Sample Categories ---');
        categories.forEach(c => console.log(`${c.name}: image=${c.image}`));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkImages();
