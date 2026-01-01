const express = require('express');
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categories');

const { upload } = require('../utils/storage');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(getCategories)
    .post(protect, authorize('admin'), upload.single('image'), createCategory);

router
    .route('/:id')
    .get(getCategory)
    .put(protect, authorize('admin'), upload.single('image'), updateCategory)
    .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
