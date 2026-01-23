const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Get dashboard stats
// @route   GET /api/v1/dashboard/stats
// @access  Private/Admin
exports.getStats = asyncHandler(async (req, res, next) => {
    try {
        // Get stats from last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalRevenue = (await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]))[0]?.total || 0;

        const recentOrders = await Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const pendingOrders = await Order.countDocuments({ orderStatus: 'Requested' });
        const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
        const deliveredOrders = await Order.countDocuments({ isPaid: true, isDelivered: true });

        const outOfStockProducts = await Product.countDocuments({ status: 'Out of Stock' });
        const featuredProducts = await Product.countDocuments({ isFeatured: true });

        const revenueThisMonth = (await Order.aggregate([
            { $match: { isPaid: true, createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]))[0]?.total || 0;

        res.status(200).json({
            success: true,
            data: {
                orders: {
                    total: totalOrders,
                    recent: recentOrders,
                    pending: pendingOrders,
                    processing: processingOrders,
                    delivered: deliveredOrders
                },
                products: {
                    total: totalProducts,
                    outOfStock: outOfStockProducts,
                    featured: featuredProducts
                },
                users: {
                    total: totalUsers
                },
                revenue: {
                    total: totalRevenue,
                    thisMonth: revenueThisMonth,
                    average: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message || 'Error fetching dashboard stats'
        });
    }
});

// @desc    Get sales chart data
// @route   GET /api/v1/dashboard/sales-chart
// @access  Private/Admin
exports.getSalesChart = asyncHandler(async (req, res, next) => {
    try {
        const days = 30;
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const sales = await Order.countDocuments({
                createdAt: { $gte: date, $lt: nextDate },
                isPaid: true
            });

            const revenue = (await Order.aggregate([
                { $match: { createdAt: { $gte: date, $lt: nextDate }, isPaid: true } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]))[0]?.total || 0;

            data.push({
                date: date.toISOString().split('T')[0],
                sales,
                revenue: Math.round(revenue)
            });
        }

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message || 'Error fetching sales chart'
        });
    }
});

// @desc    Get top selling products
// @route   GET /api/v1/dashboard/top-products
// @access  Private/Admin
exports.getTopProducts = asyncHandler(async (req, res, next) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: '$orderItems' },
            { $group: {
                _id: '$orderItems.product',
                totalQty: { $sum: '$orderItems.qty' },
                totalRevenue: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } },
                name: { $first: '$orderItems.name' }
            }},
            { $sort: { totalQty: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            count: topProducts.length,
            data: topProducts
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message || 'Error fetching top products'
        });
    }
});
