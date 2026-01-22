const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const checkImages = async () => {
    try {
        await connectDB();

        const products = await Product.find().limit(3).select('name image images');
        const categories = await Category.find().limit(3).select('name image');

        console.log('JSON_START');
        console.log(JSON.stringify({ products, categories }, null, 2));
        console.log('JSON_END');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkImages();
