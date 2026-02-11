const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');

// @desc    Get all products with pagination and filtering
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, category, search, featured, sortBy = '-createdAt' } = req.query;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    if (featured === 'true') filter.isFeatured = true;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
        .populate('category', 'name')
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
        success: true,
        count: products.length,
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        data: products
    });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
    // 1. Pick only text fields to ensure no junk image objects survive
    const { name, category, price, discountPrice, quantity, description, isFeatured, isDiwaliSpecial, pack, videoUrl, sku } = req.body;
    const cleanData = { name, category, price, discountPrice, quantity, description, isFeatured, isDiwaliSpecial, pack, videoUrl, sku };

    // --- Image Handling ---
    let finalImages = [];

    // 1. Add new uploaded images
    if (req.files && req.files.length > 0) {
        finalImages = req.files.map(file => {
            let url = file.path;
            if (!url.startsWith('http')) {
                url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            }
            return url;
        });
    }

    // 2. Add existing images if any (rare for create, but good for consistency)
    if (req.body.existingImages) {
        const existing = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
        finalImages = [...finalImages, ...existing];
    }

    if (finalImages.length > 0) {
        cleanData.images = finalImages;
        cleanData.image = finalImages[0];
    }

    // Sanitize data types
    if (cleanData.price) cleanData.price = Number(cleanData.price);
    if (cleanData.discountPrice) cleanData.discountPrice = Number(cleanData.discountPrice);
    if (cleanData.quantity) cleanData.quantity = Number(cleanData.quantity);

    // Handle boolean strings from FormData
    if (cleanData.isFeatured === 'true') cleanData.isFeatured = true;
    if (cleanData.isFeatured === 'false') cleanData.isFeatured = false;
    if (cleanData.isDiwaliSpecial === 'true') cleanData.isDiwaliSpecial = true;
    if (cleanData.isDiwaliSpecial === 'false') cleanData.isDiwaliSpecial = false;

    try {
        const product = await Product.create(cleanData);

        // Notify all users about the new product (Fire and forget, don't wait)
        try {
            const { notifyAllUsers } = require('../utils/notifications');
            notifyAllUsers(
                'New Arrival! 🎆',
                `${product.name} is now available. Check it out!`,
                'promotion',
                { productId: product._id }
            );
        } catch (notifErr) {
            console.error('[Create Product] Notification Error:', notifErr.message);
        }

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('[Create Product] DB Error:', error.message);
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message).join(', ');
            return res.status(400).json({ success: false, error: message });
        }
        next(error);
    }
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Capture old states for notifications
    const wasDiwaliSpecial = product.isDiwaliSpecial;
    const wasFeatured = product.isFeatured;

    // --- Image Handling ---
    let finalImages = [];

    // 1. Add existing images (if any were passed back)
    if (req.body.existingImages) {
        if (Array.isArray(req.body.existingImages)) {
            finalImages = [...req.body.existingImages];
        } else {
            finalImages = [req.body.existingImages];
        }
    }

    // 2. Add new uploaded images
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => {
            let url = file.path;
            if (!url.startsWith('http')) {
                url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            }
            return url;
        });
        finalImages = [...finalImages, ...newImages];
    } else if (req.file) {
        // Fallback for single file upload middleware usage
        let url = req.file.path;
        if (!url.startsWith('http')) {
            url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        finalImages.push(url);
    }

    // --- Construct Clean Update Data ---
    // Explicitly pick fields to avoid CastErrors from junk FormData
    const { name, category, price, discountPrice, quantity, description, pack, videoUrl, sku, status } = req.body;

    // Handle boolean strings from FormData
    let { isFeatured, isDiwaliSpecial } = req.body;
    if (isFeatured === 'true') isFeatured = true;
    if (isFeatured === 'false') isFeatured = false;
    if (isDiwaliSpecial === 'true') isDiwaliSpecial = true;
    if (isDiwaliSpecial === 'false') isDiwaliSpecial = false;

    const updateData = {
        name, category, price, discountPrice, quantity, description,
        pack, videoUrl, sku, status, isFeatured, isDiwaliSpecial
    };

    // Remove undefined fields (schema might default them otherwise, or we want to keep existing)
    // For findByIdAndUpdate, undefined values in object usually effectively ignore the field update, but safer to remove.
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // 3. Update images in updateData
    if (finalImages.length > 0 || req.body.existingImages) {
        updateData.images = finalImages;
        updateData.image = finalImages[0]; // Update primary image
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
    });

    // Check for status changes to trigger notifications
    const { notifyAllUsers } = require('../utils/notifications');

    // 1. New Diwali Special
    if (!wasDiwaliSpecial && product.isDiwaliSpecial) {
        notifyAllUsers(
            'Diwali Special Alert! 🕯️',
            `${product.name} is now a Diwali Special! Shop now for the best deals.`,
            'promotion',
            { productId: product._id }
        );
    }

    // 2. New Featured Product (only notify if not already notified as Diwali special to avoid spam)
    else if (!wasFeatured && product.isFeatured) {
        notifyAllUsers(
            'Featured Product! ⭐',
            `Check out our featured product: ${product.name}`,
            'promotion',
            { productId: product._id }
        );
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
// @desc    Search products
// @route   GET /api/v1/products/search/query
// @access  Public
exports.searchProducts = asyncHandler(async (req, res, next) => {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Search query is required'
        });
    }

    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const products = await Product.find({
        $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { sku: { $regex: q, $options: 'i' } }
        ]
    })
        .populate('category', 'name')
        .limit(limitNum);

    res.status(200).json({
        success: true,
        count: products.length,
        query: q,
        data: products
    });
});

// @desc    Download price list as PDF
// @route   GET /api/v1/products/download/pdf
// @access  Public
exports.downloadPriceListPDF = asyncHandler(async (req, res, next) => {
    try {
        const products = await Product.find({ status: 'Active' })
            .populate('category', 'name')
            .sort('category');

        const doc = new PDFDocument({ margin: 30 });

        // Finalize headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=CrackerShop_PriceList.pdf');

        doc.pipe(res);

        // Header Title
        doc.fillColor('#ff7f00').fontSize(24).text('CrackerShop Price List', { align: 'center' });
        doc.fillColor('#666').fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);

        // Table Header Styling
        const tableTop = 150;
        doc.fillColor('#000').fontSize(12).font('Helvetica-Bold');
        doc.text('Category', 50, tableTop);
        doc.text('Product Name', 150, tableTop);
        doc.text('Pack', 380, tableTop, { width: 70, align: 'center' });
        doc.text('Price', 460, tableTop, { width: 100, align: 'right' });

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // Table Content
        let y = tableTop + 25;
        doc.font('Helvetica').fontSize(10);

        products.forEach((p, index) => {
            // Check for page break
            if (y > 700) {
                doc.addPage();
                y = 50; // Reset Y on new page
            }

            const categoryName = p.category ? p.category.name : 'Uncategorized';

            doc.fillColor(index % 2 === 0 ? '#333' : '#555');
            doc.text(categoryName, 50, y, { width: 90 });
            doc.text(p.name, 150, y, { width: 220 });
            doc.text(p.pack || '-', 380, y, { width: 70, align: 'center' });
            doc.text(`₹${p.price}`, 460, y, { width: 100, align: 'right' });

            y += 20; // Row height
        });

        // Footer
        doc.fontSize(8).fillColor('#999').text('Thank you for shopping with CrackerShop!', 0, 750, { align: 'center' });

        doc.end();
    } catch (err) {
        console.error('PDF Generation Error:', err);
        res.status(500).json({ success: false, error: 'Could not generate PDF' });
    }
});

// @desc    Download price list as Excel
// @route   GET /api/v1/products/download/excel
// @access  Public
exports.downloadPriceListExcel = asyncHandler(async (req, res, next) => {
    try {
        const products = await Product.find({ status: 'active' })
            .populate('category', 'name')
            .sort('category');

        const excelData = products.map(p => ({
            'Category': p.category ? p.category.name : 'Uncategorized',
            'Product Name': p.name,
            'Pack Type': p.pack || 'N/A',
            'Price (INR)': p.price,
            'Discount Price': p.discountPrice || '-',
            'Stock Status': p.quantity > 0 ? 'Available' : 'Out of Stock'
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

        // Format column widths
        const wscols = [
            { wch: 20 }, // Category
            { wch: 40 }, // Name
            { wch: 15 }, // Pack
            { wch: 15 }, // Price
            { wch: 15 }, // Discount
            { wch: 15 }  // Status
        ];
        worksheet['!cols'] = wscols;

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=CrackerShop_Inventory.xlsx');
        res.status(200).send(buffer);

    } catch (err) {
        console.error('Excel Generation Error:', err);
        res.status(500).json({ success: false, error: 'Could not generate Excel' });
    }
});