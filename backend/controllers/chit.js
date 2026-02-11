const ChitScheme = require('../models/ChitScheme');
const ChitPayment = require('../models/ChitPayment');
const ErrorResponse = require('../utils/errorResponse');

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

exports.getScheme = async (req, res, next) => {
    try {
        console.log(`[BACKEND DEBUG] Fetching scheme: ${req.params.id}`);
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

        // Check for payment reminders
        const { createNotification } = require('../utils/notifications');
        const Notification = require('../models/Notification');

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

        // Fetch fresh user details to ensure we have mobileNumber
        const user = await require('../models/User').findById(req.user.id);
        const userDetails = {
            name: user.name,
            mobileNumber: user.mobileNumber || ''
        };
        console.log('[DEBUG] User details for My Schemes:', userDetails);

        // Pre-process schemes to add nextDueDate, daysRemaining and user details
        const resultData = mySchemes.map(item => {
            const { scheme, monthsPaid, payments } = item;

            // Default props
            let nextDueDate = null;
            let daysRemaining = null;

            // Find enrollment date
            const enrollmentPayment = payments.find(p => p.monthIndex === 0 && p.status === 'Paid');

            if (enrollmentPayment) {
                const joinDate = new Date(enrollmentPayment.paymentDate);

                // Calculate next due date: Join Date + ((MonthsPaid + 1) * 30 days)
                // This will always show the "upcoming" 30-day target
                const nextPaymentTime = joinDate.getTime() + ((monthsPaid + 1) * 30 * 24 * 60 * 60 * 1000);
                nextDueDate = new Date(nextPaymentTime);

                // Calculate days remaining
                const diffTime = nextDueDate - today;
                daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }

            return {
                ...item,
                user: userDetails, // Pass user info to frontend
                joinDate: enrollmentPayment ? enrollmentPayment.paymentDate : null,
                nextDueDate,
                daysRemaining
            };
        });
        // Use for...of for async/await compatibility
        for (const item of resultData) {
            const { scheme, monthsPaid, payments } = item;

            if (monthsPaid < scheme.durationMonths) {
                // 1. Check if they have already paid for the current target period
                // We use monthIndex to track which month's payment it is.
                // If they have paid N months, their next expected monthIndex is N.

                // Calculate how many months SHOULD have been paid based on when they joined
                // Month 0 is join month.
                const enrollmentPayment = payments.find(p => p.monthIndex === 0);
                if (!enrollmentPayment) continue;

                const joinDate = new Date(enrollmentPayment.paymentDate);
                const monthsSinceJoin = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());

                // If they have paid fewer months than have passed since they joined, they are due.
                // Or if it's the 1st of the month, they might be due for the new month.
                if (monthsPaid <= monthsSinceJoin) {
                    // 2. Check if we already sent a reminder THIS calendar month
                    const existingReminder = await Notification.findOne({
                        user: req.user.id,
                        type: 'chit',
                        'data.schemeId': scheme._id,
                        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                    });

                    if (!existingReminder) {
                        await createNotification(
                            req.user.id,
                            'Chit Payment Reminder ⏰',
                            `It's time to pay your ₹${scheme.installmentAmount} installment for ${scheme.name}. Keep your savings growing!`,
                            'chit',
                            { schemeId: scheme._id }
                        );
                    }
                }
            }
        }

        res.status(200).json({
            success: true,
            count: mySchemes.length,
            count: resultData.length,
            data: resultData
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

        // Notify user about payment confirmation
        const { createNotification } = require('../utils/notifications');
        createNotification(
            req.user.id,
            'Chit Payment Received! 💰',
            `Your payment of ₹${amount} for ${scheme.name} (Month ${monthIndex + 1}) has been confirmed.`,
            'chit',
            { schemeId: scheme._id, paymentId: payment._id }
        );

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
        console.log(`[BACKEND DEBUG] Fetching participants for scheme: ${req.params.id}`);
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
                // Capture join date for calculation
                if (p.monthIndex === 0) {
                    participantsMap[userId].joinDate = p.paymentDate;
                }
            } else if (p.status === 'Pending' && p.monthIndex === 0) {
                // Mark as Pending Approval
                participantsMap[userId].isPendingApproval = true;
            }
        });

        const participants = Object.values(participantsMap).map(p => {
            let nextDueDate = null;
            let daysRemaining = null;

            if (p.joinDate && p.paidMonths < scheme.durationMonths) {
                const joinDate = new Date(p.joinDate);
                const nextPaymentTime = joinDate.getTime() + (p.paidMonths * 30 * 24 * 60 * 60 * 1000);
                nextDueDate = new Date(nextPaymentTime);
                const diffTime = nextPaymentTime - Date.now();
                daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }

            return {
                id: p.user._id,
                name: p.user.name,
                email: p.user.email,
                paidMonths: p.paidMonths,
                pending: scheme.durationMonths - p.paidMonths,
                status: p.isPendingApproval ? 'Pending Approval' : (p.paidMonths >= 1 ? 'Active' : 'Joined'),
                nextDueDate,
                daysRemaining
            };
        });

        res.status(200).json({
            success: true,
            count: participants.length,
            data: participants
        });
    } catch (err) {
        next(err);
    }
};
// @desc      Record payment for a user (Admin)
// @route     POST /api/v1/chit/admin/pay
// @access    Private/Admin
exports.recordUserPayment = async (req, res, next) => {
    try {
        console.log('Record Payment Request Body:', req.body);
        const { schemeId, userId } = req.body;

        const scheme = await ChitScheme.findById(schemeId);
        if (!scheme) {
            return next(new ErrorResponse('Scheme not found', 404));
        }

        // Find all existing payments for this user & scheme
        const existingPayments = await ChitPayment.find({
            user: userId,
            scheme: schemeId,
            status: 'Paid'
        });

        const nextMonthIndex = existingPayments.length;
        console.log(`User ${userId} has ${nextMonthIndex} existing payments for scheme ${schemeId}`);

        if (nextMonthIndex >= scheme.durationMonths) {
            return next(new ErrorResponse('This user has already completed the scheme', 400));
        }

        const payment = await ChitPayment.create({
            user: userId,
            scheme: schemeId,
            amount: scheme.installmentAmount,
            monthIndex: nextMonthIndex,
            status: 'Paid'
        });

        console.log('Payment created:', payment);

        // Notify user about payment confirmation
        try {
            await createNotification(
                userId,
                'Chit Payment Recorded 📝',
                `Admin has recorded your payment of ₹${scheme.installmentAmount} for ${scheme.name} (Month ${nextMonthIndex + 1}).`,
                'chit',
                { schemeId: scheme._id, paymentId: payment._id }
            );
        } catch (notifError) {
            console.error('Notification failed:', notifError);
            // Continue execution, don't fail the request
        }

        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (err) {
        console.error('Record Payment Error:', err);
        next(err);
    }
};

exports.requestJoin = async (req, res, next) => {
    try {
        const { schemeId, name, mobileNumber, address } = req.body;

        const scheme = await ChitScheme.findById(schemeId);
        if (!scheme) {
            return next(new ErrorResponse('Scheme not found', 404));
        }

        // Use provided details or fallback to user profile
        const participantName = name || req.user.name;
        const participantMobile = mobileNumber || req.user.mobileNumber;
        const participantAddress = address || req.user.address;

        // Check if user has already joined this scheme
        const alreadyJoined = await ChitPayment.findOne({
            user: req.user.id,
            scheme: schemeId
        });

        if (alreadyJoined) {
            return next(new ErrorResponse('You are already a member of this scheme', 400));
        }

        // Create the enrollment (first month payment record)
        const enrollment = await ChitPayment.create({
            user: req.user.id,
            scheme: schemeId,
            amount: scheme.installmentAmount,
            monthIndex: 0,
            status: 'Pending' // Requires Admin Approval
        });

        // Notify Admins
        const { notifyAdmins } = require('../utils/notifications');
        await notifyAdmins(
            'New Chit Request! ⏳',
            `Participant: ${participantName}\nMobile: ${participantMobile}\nAddress: ${participantAddress}\nScheme: ${scheme.name}\nStatus: Pending Approval`,
            'chit',
            {
                schemeId: scheme._id,
                userId: req.user._id,
                paymentId: enrollment._id,
                customDetails: { name: participantName, mobile: participantMobile, address: participantAddress }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Your request has been sent for approval!',
            data: enrollment
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Approve join request
// @route     POST /api/v1/chit/admin/approve
// @access    Private/Admin
exports.approveJoinRequest = async (req, res, next) => {
    try {
        const { userId, schemeId } = req.body;

        const enrollment = await ChitPayment.findOne({
            user: userId,
            scheme: schemeId,
            monthIndex: 0,
            status: 'Pending'
        });

        if (!enrollment) {
            return next(new ErrorResponse('No pending request found for this user', 404));
        }

        enrollment.status = 'Paid';
        enrollment.paymentDate = Date.now(); // Set the cycle start date to approval time
        await enrollment.save();

        const scheme = await ChitScheme.findById(schemeId);

        // Notify User
        const { createNotification } = require('../utils/notifications');
        createNotification(
            userId,
            'Chit Request Approved! ✅',
            `Your request to join ${scheme.name} has been approved. Welcome aboard!`,
            'chit',
            { schemeId: scheme._id }
        );

        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Reject join request
// @route     POST /api/v1/chit/admin/reject
// @access    Private/Admin
exports.rejectJoinRequest = async (req, res, next) => {
    try {
        const { userId, schemeId } = req.body;

        const enrollment = await ChitPayment.findOne({
            user: userId,
            scheme: schemeId,
            monthIndex: 0,
            status: 'Pending'
        });

        if (!enrollment) {
            return next(new ErrorResponse('No pending request found for this user', 404));
        }

        await enrollment.deleteOne();

        const scheme = await ChitScheme.findById(schemeId);

        // Notify User
        const { createNotification } = require('../utils/notifications');
        createNotification(
            userId,
            'Chit Request Rejected ❌',
            `Your request to join ${scheme.name} was not approved. catch admin for support`,
            'chit',
            { schemeId: scheme._id }
        );

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
