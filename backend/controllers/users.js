const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get all users with pagination
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, role, status, sortBy = '-createdAt' } = req.query;
        
        const filter = {};
        if (role) filter.role = role;
        if (status) filter.status = status;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const users = await User.find(filter)
            .select('-password')
            .sort(sortBy)
            .skip(skip)
            .limit(limitNum);

        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            pages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: users
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorResponse(`No user found with the id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        // Only allow updating role or status for now
        const { role, status } = req.body;
        const fieldsToUpdate = {};
        if (role) fieldsToUpdate.role = role;
        if (status) fieldsToUpdate.status = status;

        const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return next(new ErrorResponse(`No user found with the id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorResponse(`No user found with the id of ${req.params.id}`, 404));
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
