const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.addOrderItems = asyncHandler(async (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        return next(new ErrorResponse('No order items', 400));
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();

        res.status(201).json({
            success: true,
            data: createdOrder
        });
    }
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({}).populate('user', 'id name');

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    order.orderStatus = req.body.status || order.orderStatus;

    if (req.body.status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    // Notify user about order status change
    const { createNotification } = require('../utils/notifications');
    createNotification(
        order.user,
        'Order Status Updated 📦',
        `Your order #${order._id.toString().slice(-6).toUpperCase()} is now ${updatedOrder.orderStatus}.`,
        'order',
        { orderId: order._id }
    );

    res.status(200).json({
        success: true,
        data: updatedOrder
    });
});
