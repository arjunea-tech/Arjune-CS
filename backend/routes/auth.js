const express = require('express');
const { register, login, googleLogin, getMe, updateDetails, addAddress, deleteAddress, setDefaultAddress, resetPassword, forgotPassword, changePassword } = require('../controllers/auth');

const { protect } = require('../middleware/auth');
const { upload } = require('../utils/storage');
const { validators, validateRequest } = require('../utils/validation');
const { authRateLimiter } = require('../middleware/security');

const router = express.Router();

// Apply auth rate limiter to sensitive routes
router.post('/register', authRateLimiter, upload.single('avatar'), validators.register, validateRequest, register);
router.post('/login', authRateLimiter, validators.login, validateRequest, login);
router.post('/google', googleLogin);
router.post('/forgotpassword', authRateLimiter, forgotPassword);
router.post('/resetpassword', authRateLimiter, resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, upload.single('avatar'), updateDetails);
router.put('/change-password', protect, changePassword);

// Address routes
router.post('/addresses', protect, addAddress);
router.put('/addresses/:id/default', protect, setDefaultAddress);
router.delete('/addresses/:id', protect, deleteAddress);

module.exports = router;
