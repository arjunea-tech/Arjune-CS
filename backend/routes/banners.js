const express = require('express');
const {
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner
} = require('../controllers/banners');

const { upload } = require('../utils/storage');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(getBanners)
    .post(protect, authorize('admin'), upload.single('image'), createBanner);

router
    .route('/:id')
    .put(protect, authorize('admin'), upload.single('image'), updateBanner)
    .delete(protect, authorize('admin'), deleteBanner);

module.exports = router;
