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

const clearImages = async () => {
    try {
        await connectDB();

        console.log('Clearing product images to empty string...');
        const productResult = await Product.updateMany(
            {},
            {
                $set: {
                    image: '',
                    images: []
                }
            }
        );
        console.log(`Products updated: ${productResult.modifiedCount}`);

        console.log('Clearing category images to empty string...');
        const categoryResult = await Category.updateMany(
            {},
            {
                $set: {
                    image: ''
                }
            }
        );
        console.log(`Categories updated: ${categoryResult.modifiedCount}`);

        console.log('All images cleared to empty string successfully');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

clearImages();
