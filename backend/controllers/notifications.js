const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all notifications for a user
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
    const notifications = await Notification.find({ user: req.user.id }).sort('-createdAt');

    res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications
    });
});

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
        return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns notification
    if (notification.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User not authorized to update this notification`, 401));
    }

    notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: notification
    });
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
    await Notification.updateMany(
        { user: req.user.id, isRead: false },
        { isRead: true }
    );

    res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
    });
});

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns notification
    if (notification.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User not authorized to delete this notification`, 401));
    }

    await notification.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
