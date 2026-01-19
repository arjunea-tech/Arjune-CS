const express = require('express');
const {
    getSchemes,
    getScheme,
    createScheme,
    updateScheme,
    deleteScheme,
    getMySchemes,
    payInstallment,
    getSchemeParticipants,
    requestJoin,
    recordUserPayment,
    approveJoinRequest,
    rejectJoinRequest
} = require('../controllers/chit');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public routes (List schemes)
router.get('/schemes', getSchemes);
router.get('/schemes/:id', getScheme);

// Protected User routes
router.get('/my', protect, getMySchemes);
router.post('/pay', protect, payInstallment);
router.post('/request-join', protect, requestJoin);

// Protected Admin routes for Schemes management
router.post('/schemes', protect, authorize('admin'), createScheme);
router.put('/schemes/:id', protect, authorize('admin'), updateScheme);
router.get('/schemes/:id/participants', protect, authorize('admin'), getSchemeParticipants);
router.delete('/schemes/:id', protect, authorize('admin'), deleteScheme);
router.post('/admin/pay', protect, authorize('admin'), recordUserPayment);
router.post('/admin/approve', protect, authorize('admin'), approveJoinRequest);
router.post('/admin/reject', protect, authorize('admin'), rejectJoinRequest);

module.exports = router;
