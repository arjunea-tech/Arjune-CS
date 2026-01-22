const express = require('express');
const { register, login, getMe, updateDetails, addAddress, deleteAddress, setDefaultAddress, resetPassword } = require('../controllers/auth');

const { protect } = require('../middleware/auth');
const { upload } = require('../utils/storage');
const { validators, validateRequest } = require('../utils/validation');
const { authRateLimiter } = require('../middleware/security');

const router = express.Router();

// Apply auth rate limiter to sensitive routes
router.post('/register', authRateLimiter, upload.single('avatar'), validators.register, validateRequest, register);
router.post('/login', authRateLimiter, validators.login, validateRequest, login);
router.post('/resetpassword', authRateLimiter, login); // Password reset endpoint

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, upload.single('avatar'), updateDetails);

// Address routes
router.post('/addresses', protect, addAddress);
router.put('/addresses/:id/default', protect, setDefaultAddress);
router.delete('/addresses/:id', protect, deleteAddress);

module.exports = router;
