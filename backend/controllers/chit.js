const ChitScheme = require('../models/ChitScheme');
const ChitPayment = require('../models/ChitPayment');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get all chit schemes
// @route     GET /api/v1/chit/schemes
// @access    Public
exports.getSchemes = async (req, res, next) => {
    try {
        const schemes = await ChitScheme.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: schemes.length,
            data: schemes
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Get single chit scheme
// @route     GET /api/v1/chit/schemes/:id
// @access    Public
exports.getScheme = async (req, res, next) => {
    try {
        const scheme = await ChitScheme.findById(req.params.id);

        if (!scheme) {
            return next(new ErrorResponse(`No scheme found with the id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: scheme
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Create new chit scheme
// @route     POST /api/v1/chit/schemes
// @access    Private/Admin
exports.createScheme = async (req, res, next) => {
    try {
        const scheme = await ChitScheme.create(req.body);

        res.status(201).json({
            success: true,
            data: scheme
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Update chit scheme
// @route     PUT /api/v1/chit/schemes/:id
// @access    Private/Admin
exports.updateScheme = async (req, res, next) => {
    try {
        let scheme = await ChitScheme.findById(req.params.id);

        if (!scheme) {
            return next(new ErrorResponse(`No scheme found with the id of ${req.params.id}`, 404));
        }

        scheme = await ChitScheme.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: scheme
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Delete chit scheme
// @route     DELETE /api/v1/chit/schemes/:id
// @access    Private/Admin
exports.deleteScheme = async (req, res, next) => {
    try {
        const scheme = await ChitScheme.findById(req.params.id);

        if (!scheme) {
            return next(new ErrorResponse(`No scheme found with the id of ${req.params.id}`, 404));
        }

        await scheme.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Get my enrolled schemes (via payments)
// @route     GET /api/v1/chit/my
// @access    Private (User)
exports.getMySchemes = async (req, res, next) => {
    try {
        // Find all payments made by this user
        const payments = await ChitPayment.find({ user: req.user.id }).populate('scheme');

        // Group payments by scheme to show progress
        const schemesMap = {};
        payments.forEach(p => {
            if (!p.scheme) return; // Handle if scheme was deleted
            const schemeId = p.scheme._id.toString();
            if (!schemesMap[schemeId]) {
                schemesMap[schemeId] = {
                    scheme: p.scheme,
                    payments: [],
                    totalPaid: 0,
                    monthsPaid: 0
                };
            }
            schemesMap[schemeId].payments.push(p);
            if (p.status === 'Paid') {
                schemesMap[schemeId].totalPaid += p.amount;
                schemesMap[schemeId].monthsPaid += 1;
            }
        });

        const mySchemes = Object.values(schemesMap);

        res.status(200).json({
            success: true,
            count: mySchemes.length,
            data: mySchemes
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Pay installment (Create Payment)
// @route     POST /api/v1/chit/pay
// @access    Private (User)
exports.payInstallment = async (req, res, next) => {
    try {
        const { schemeId, amount, monthIndex } = req.body;

        const scheme = await ChitScheme.findById(schemeId);
        if (!scheme) {
            return next(new ErrorResponse('Scheme not found', 404));
        }

        // Validate amount matches installment (strict for now)
        // if (amount !== scheme.installmentAmount) {
        //     return next(new ErrorResponse(`Incorrect installment amount. Expected ${scheme.installmentAmount}`, 400));
        // }

        // Check if payment already exists for this user, scheme, and month
        const existingPayment = await ChitPayment.findOne({
            user: req.user.id,
            scheme: schemeId,
            monthIndex: monthIndex
        });

        if (existingPayment) {
            return next(new ErrorResponse('Payment for this month already exists', 400));
        }

        const payment = await ChitPayment.create({
            user: req.user.id,
            scheme: schemeId,
            amount,
            monthIndex,
            status: 'Paid'
        });

        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (err) {
        next(err);
    }
};
// @desc      Get scheme participants and their progress
// @route     GET /api/v1/chit/schemes/:id/participants
// @access    Private/Admin
exports.getSchemeParticipants = async (req, res, next) => {
    try {
        const scheme = await ChitScheme.findById(req.params.id);
        if (!scheme) {
            return next(new ErrorResponse('Scheme not found', 404));
        }

        const payments = await ChitPayment.find({ scheme: req.params.id }).populate('user');

        const participantsMap = {};
        payments.forEach(p => {
            if (!p.user) return; // Handle if user deleted
            const userId = p.user._id.toString();
            if (!participantsMap[userId]) {
                participantsMap[userId] = {
                    user: p.user,
                    paidMonths: 0,
                    totalPaid: 0,
                    status: 'Up to Date'
                };
            }
            if (p.status === 'Paid') {
                participantsMap[userId].paidMonths += 1;
                participantsMap[userId].totalPaid += p.amount;
            }
        });

        const participants = Object.values(participantsMap).map(p => ({
            id: p.user._id,
            name: p.user.name,
            email: p.user.email,
            paidMonths: p.paidMonths,
            pending: scheme.durationMonths - p.paidMonths,
            status: p.paidMonths >= 1 ? 'Active' : 'Joined' // Simplified
        }));

        res.status(200).json({
            success: true,
            count: participants.length,
            data: participants
        });
    } catch (err) {
        next(err);
    }
};
