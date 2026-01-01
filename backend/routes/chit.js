const express = require('express');
const {
    getSchemes,
    getScheme,
    createScheme,
    updateScheme,
    deleteScheme,
    getMySchemes,
    payInstallment,
    getSchemeParticipants
} = require('../controllers/chit');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public routes (List schemes)
router.get('/schemes', getSchemes);
router.get('/schemes/:id', getScheme);

// Protected User routes
router.get('/my', protect, getMySchemes);
router.post('/pay', protect, payInstallment);

// Protected Admin routes for Schemes management
router.post('/schemes', protect, authorize('admin'), createScheme);
router.put('/schemes/:id', protect, authorize('admin'), updateScheme);
router.get('/schemes/:id/participants', protect, authorize('admin'), getSchemeParticipants);
router.delete('/schemes/:id', protect, authorize('admin'), deleteScheme);

module.exports = router;
