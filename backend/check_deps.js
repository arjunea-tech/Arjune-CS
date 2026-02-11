const deps = [
    'express', 'cors', 'morgan', 'dotenv', 'mongoose',
    'express-mongo-sanitize', 'express-rate-limit', 'helmet',
    'hpp', 'jsonwebtoken', 'multer', 'winston', 'xss-clean',
    'bcryptjs', 'cloudinary', 'multer-storage-cloudinary'
];

deps.forEach(dep => {
    try {
        require(dep);
        console.log(`${dep} ok`);
    } catch (e) {
        console.log(`${dep} failed: ${e.message}`);
    }
});

const localDeps = [
    './config/db', './utils/logger', './middleware/security',
    './routes/categories'
];

localDeps.forEach(dep => {
    try {
        require(dep);
        console.log(`${dep} ok`);
    } catch (e) {
        console.log(`${dep} failed: ${e.message}`);
    }
});
