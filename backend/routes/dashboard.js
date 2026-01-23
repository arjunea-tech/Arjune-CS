const express = require('express');
const {
    getStats,
    getSalesChart,
    getTopProducts
} = require('../controllers/dashboard');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require admin access
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/sales-chart', getSalesChart);
router.get('/top-products', getTopProducts);

module.exports = router;
