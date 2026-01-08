const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🌱 Connected to MongoDB...');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};

const crackerCategories = [
    { name: 'Sparklers', description: 'Handheld colorful sparklers for all ages.' },
    { name: 'Flower Pots', description: 'Conical fountain crackers that produce beautiful sparks.' },
    { name: 'Ground Spinners', description: 'Chakkars that spin on the ground with vibrant colors.' },
    { name: 'Rockets', description: 'Aerial crackers that soar into the sky.' },
    { name: 'Bombs', description: 'Sound-emphasized crackers for a loud celebration.' },
    { name: 'Garland Crackers', description: 'Strings of crackers (Larres) that burst sequentially.' },
    { name: 'Fancy Crackers', description: 'Aerial shots and multi-color fountains.' },
    { name: 'Kids Special', description: 'Soft and safe crackers designed specifically for children.' },
    { name: 'Multicolor Shots', description: 'Aerial fireworks that burst into multiple colors.' },
    { name: 'Gift Boxes', description: 'Assorted collection of various crackers in one box.' }
];

const generateProducts = (categoryMap) => {
    const products = [];

    // Sparklers
    const sparklerVariants = ['Electric', 'Color', 'Gold', 'Silver', 'Magic', 'Red', 'Green', 'Mega', 'Giant'];
    const sparklerSizes = ['10cm', '12cm', '15cm', '30cm', '50cm'];

    sparklerVariants.forEach(variant => {
        sparklerSizes.forEach(size => {
            if (products.length < 100) {
                products.push({
                    name: `${variant} Sparklers - ${size}`,
                    category: categoryMap['Sparklers'],
                    price: Math.floor(Math.random() * 200) + 50,
                    discountPrice: Math.floor(Math.random() * 40) + 30,
                    quantity: Math.floor(Math.random() * 500) + 100,
                    description: `High quality ${variant} sparklers in ${size} size. Safe and vibrant.`,
                    pack: '10 Pcs per Box',
                    status: 'Active'
                });
            }
        });
    });

    // Flower Pots
    const potsVariants = ['Small', 'Big', 'Special', 'Ashoka', 'Color', 'Ganga Jamuna', 'Deluxe', 'Super'];
    potsVariants.forEach(variant => {
        products.push({
            name: `${variant} Flower Pot`,
            category: categoryMap['Flower Pots'],
            price: Math.floor(Math.random() * 400) + 100,
            discountPrice: Math.floor(Math.random() * 80) + 70,
            quantity: Math.floor(Math.random() * 300) + 50,
            description: `Beautiful ${variant} flower pot with towering sparks.`,
            pack: '10 Pcs per Box',
            status: 'Active',
            isDiwaliSpecial: Math.random() > 0.7
        });
    });

    // Ground Spinners
    const spinnerVariants = ['Big', 'Small', 'Special', 'Zwig Zag', 'Color', 'Disco'];
    spinnerVariants.forEach(variant => {
        products.push({
            name: `${variant} Ground Spinner`,
            category: categoryMap['Ground Spinners'],
            price: Math.floor(Math.random() * 300) + 80,
            discountPrice: Math.floor(Math.random() * 60) + 50,
            quantity: Math.floor(Math.random() * 400) + 100,
            description: `Vibrant ${variant} ground spinner for classic fun.`,
            pack: '10 Pcs per Box',
            status: 'Active'
        });
    });

    // Rockets
    const rocketVariants = ['Baby', 'Sound', 'Luminous', 'Whistling', '2-Shot', 'Moon', 'Space'];
    rocketVariants.forEach(variant => {
        products.push({
            name: `${variant} Rocket`,
            category: categoryMap['Rockets'],
            price: Math.floor(Math.random() * 500) + 150,
            discountPrice: Math.floor(Math.random() * 120) + 100,
            quantity: Math.floor(Math.random() * 200) + 50,
            description: `High-flying ${variant} rocket for aerial displays.`,
            pack: '10 Pcs per Box',
            status: 'Active',
            isFeatured: Math.random() > 0.8
        });
    });

    // Bombs
    const bombVariants = ['Atom', 'Hydro', 'Classic', 'King Kong', 'Bullet', 'Mega'];
    bombVariants.forEach(variant => {
        products.push({
            name: `${variant} Bomb`,
            category: categoryMap['Bombs'],
            price: Math.floor(Math.random() * 600) + 100,
            discountPrice: Math.floor(Math.random() * 90) + 80,
            quantity: Math.floor(Math.random() * 300) + 100,
            description: `Powerful ${variant} bomb for a loud celebration.`,
            pack: '10 Pcs per Box',
            status: 'Active'
        });
    });

    // Garlands (Larres)
    const larreVariants = ['28 Chorsa', '56 Chorsa', '100 Wala', '1000 Wala', '5000 Wala', '10000 Wala'];
    larreVariants.forEach(variant => {
        products.push({
            name: `${variant} Garland`,
            category: categoryMap['Garland Crackers'],
            price: (larreVariants.indexOf(variant) + 1) * 300,
            discountPrice: (larreVariants.indexOf(variant) + 1) * 250,
            quantity: Math.floor(Math.random() * 100) + 20,
            description: `Sequential bursting ${variant} garland for extended celebration.`,
            pack: '1 Piece',
            status: 'Active'
        });
    });

    // Fancy Crackers
    const fancyVariants = ['7 Shot', '12 Shot', '30 Shot', '60 Shot', '120 Shot', '240 Shot'];
    fancyVariants.forEach(variant => {
        products.push({
            name: `Fancy ${variant}`,
            category: categoryMap['Fancy Crackers'],
            price: (fancyVariants.indexOf(variant) + 1) * 500,
            discountPrice: (fancyVariants.indexOf(variant) + 1) * 400,
            quantity: Math.floor(Math.random() * 150) + 30,
            description: `Exotic ${variant} fancy cracker with multiple sound and light effects.`,
            pack: '1 Piece',
            status: 'Active',
            isFeatured: true
        });
    });

    // Kids Special
    const kidsVariants = ['Roll Caps', 'Ring Caps', 'Snake Eggs', 'Magic Pencil', 'Electric Sparklers', 'Pop Pop'];
    kidsVariants.forEach(variant => {
        products.push({
            name: `Kids ${variant}`,
            category: categoryMap['Kids Special'],
            price: Math.floor(Math.random() * 100) + 20,
            discountPrice: Math.floor(Math.random() * 15) + 10,
            quantity: Math.floor(Math.random() * 1000) + 200,
            description: `Safe and fun ${variant} specially for kids.`,
            pack: 'Packet',
            status: 'Active'
        });
    });

    // Multicolor Shots
    const multiVariants = ['Blue', 'Red', 'Green', 'Golden', 'Silver', 'Mix'];
    multiVariants.forEach(variant => {
        products.push({
            name: `${variant} Multicolor Shot`,
            category: categoryMap['Multicolor Shots'],
            price: Math.floor(Math.random() * 800) + 300,
            discountPrice: Math.floor(Math.random() * 250) + 200,
            quantity: Math.floor(Math.random() * 100) + 50,
            description: `Aerial shot that bursts into brilliant ${variant} colors.`,
            pack: '1 Piece',
            status: 'Active'
        });
    });

    // Gift Boxes
    const boxVariants = ['Standard', 'Silver', 'Gold', 'Platinum', 'Luxury', 'Grand'];
    boxVariants.forEach(variant => {
        products.push({
            name: `${variant} Gift Box`,
            category: categoryMap['Gift Boxes'],
            price: (boxVariants.indexOf(variant) + 1) * 1000,
            discountPrice: (boxVariants.indexOf(variant) + 1) * 800,
            quantity: Math.floor(Math.random() * 50) + 10,
            description: `Assorted collection of various crackers in the ${variant} gift box.`,
            pack: 'Box',
            status: 'Active',
            isDiwaliSpecial: true
        });
    });

    // Fill the rest if not 100
    while (products.length < 100) {
        const randomCat = Object.keys(categoryMap)[Math.floor(Math.random() * Object.keys(categoryMap).length)];
        products.push({
            name: `Misc Cracker ${products.length + 1}`,
            category: categoryMap[randomCat],
            price: Math.floor(Math.random() * 1000) + 100,
            discountPrice: Math.floor(Math.random() * 800) + 80,
            quantity: Math.floor(Math.random() * 100) + 10,
            description: `A unique miscellaneous cracker for your celebration.`,
            pack: '1 Piece',
            status: 'Active'
        });
    }

    return products;
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data by dropping collections (this also clears indexes)
        console.log('🗑️ Dropping existing categories and products...');
        try {
            await mongoose.connection.db.dropCollection('categories');
            await mongoose.connection.db.dropCollection('products');
        } catch (err) {
            console.log('Note: Collections may not exist, proceeding...');
        }

        // Seed Categories
        console.log('🌱 Seeding categories...');
        const createdCategories = await Category.insertMany(crackerCategories);

        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        // Seed Products
        console.log('🌱 Generating products...');
        const productsToSeed = generateProducts(categoryMap);

        console.log(`🌱 Seeding ${productsToSeed.length} products...`);
        await Product.insertMany(productsToSeed);

        console.log('✅ Database seeded successfully with Cracker data!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding data:');
        console.dir(err);
        process.exit(1);
    }
};

seedData();
