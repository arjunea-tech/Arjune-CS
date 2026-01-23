const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Order = require('../models/Order');
const Product = require('../models/Product');

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
        otherFees,
        discountPrice,
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
            taxPrice,
            shippingPrice,
            otherFees: otherFees || 0,
            discountPrice: discountPrice || 0,
            totalPrice
        });

        const createdOrder = await order.save();



        // Notify Admins about new order request
        const { notifyAdmins, createNotification } = require('../utils/notifications');
        await notifyAdmins(
            'New Order Request! 🛒',
            `Customer: ${req.user.name}\nMobile: ${req.user.mobileNumber}\nAddress: ${shippingAddress}\nTotal: ₹${totalPrice}`,
            'order',
            { orderId: createdOrder._id, userId: req.user._id }
        );

        // Notify User about successful order placement
        await createNotification(
            req.user._id,
            'Order Placed Successfully! 🎉',
            `Your order #${createdOrder._id.toString().slice(-6).toUpperCase()} for ₹${totalPrice} has been placed. We will process it shortly!`,
            'order',
            { orderId: createdOrder._id }
        );

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
    const order = await Order.findById(req.params.id).populate('user');

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
    const orders = await Order.find({ user: req.user._id }).populate('user');

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
    const { page = 1, limit = 10, status, sortBy = '-createdAt' } = req.query;

    const filter = {};
    if (status) filter.orderStatus = status;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(filter)
        .populate('user', 'name email mobileNumber')
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
        success: true,
        count: orders.length,
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
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

    // Check valid transitions
    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') {
        return next(new ErrorResponse(`You cannot change order status after it is ${order.orderStatus}`, 400));
    }

    const nextStatus = req.body.status;

    // Stock Management: Reduce stock only when moving to 'Processing' (first time)
    // We assume 'Requested' -> 'Processing' implies confirmation.
    if (nextStatus === 'Processing' && order.orderStatus !== 'Processing') {
        for (const item of order.orderItems) {
            console.log(`[Order Status] Reducing stock for Product ID: ${item.product} by Quantity: ${item.qty}`);
            try {
                const product = await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { quantity: -Number(item.qty) } },
                    { new: true }
                );

                if (product && product.quantity <= 0) {
                    await Product.findByIdAndUpdate(item.product, {
                        quantity: 0,
                        status: 'Out of Stock'
                    });
                }
            } catch (err) {
                console.error(`[Order Status] Failed to update stock for Product ${item.product}:`, err.message);
            }
        }
    }

    // Status Update
    order.orderStatus = nextStatus || order.orderStatus;

    if (nextStatus === 'Delivered') {
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
// @desc    Update order payment status (Manual Payment Confirmation)
// @route   PUT /api/v1/orders/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
    const { isPaid, paymentMethod } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    // Update payment status
    order.isPaid = isPaid;
    if (isPaid) {
        order.paidAt = Date.now();
    }
    if (paymentMethod) {
        order.paymentMethod = paymentMethod;
    }

    const updatedOrder = await order.save();

    // Notify user about payment confirmation
    const { createNotification } = require('../utils/notifications');
    if (isPaid) {
        createNotification(
            order.user,
            'Payment Confirmed ✅',
            `Payment of ₹${order.totalPrice} for order #${order._id.toString().slice(-6).toUpperCase()} has been confirmed.`,
            'order',
            { orderId: order._id }
        );
    }

    res.status(200).json({
        success: true,
        message: isPaid ? 'Payment marked as confirmed' : 'Payment status updated',
        data: updatedOrder
    });
});