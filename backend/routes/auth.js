const express = require('express');
const { register, login, getMe, updateDetails, addAddress, deleteAddress, setDefaultAddress, resetPassword } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');
const { upload } = require('../utils/storage');

router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.post('/resetpassword', resetPassword);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, upload.single('avatar'), updateDetails);

// Address routes
router.post('/addresses', protect, addAddress);
router.put('/addresses/:id/default', protect, setDefaultAddress);
router.delete('/addresses/:id', protect, deleteAddress);

module.exports = router;
