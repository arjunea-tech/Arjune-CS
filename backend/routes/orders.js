const express = require('express');
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus
} = require('../controllers/orders');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect); // Protect all routes

router.route('/')
    .post(addOrderItems)
    .get(authorize('admin'), getOrders);

router.route('/myorders').get(getMyOrders);

router.route('/:id').get(getOrderById);

router.route('/:id/status').put(authorize('admin'), updateOrderStatus);

module.exports = router;
