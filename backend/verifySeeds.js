const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const catCount = await Category.countDocuments();
        const prodCount = await Product.countDocuments();
        console.log(`Verification:`);
        console.log(`Categories: ${catCount}`);
        console.log(`Products: ${prodCount}`);

        const sampleProducts = await Product.find().limit(5).populate('category');
        console.log('Sample Products:');
        sampleProducts.forEach(p => {
            console.log(`- ${p.name} (${p.category ? p.category.name : 'No Category'}): ₹${p.price}`);
        });

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyData();
