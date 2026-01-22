const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products');

const { upload } = require('../utils/storage');
const { protect, authorize } = require('../middleware/auth');
const { validators, validateRequest } = require('../utils/validation');

const router = express.Router();

router
    .route('/')
    .get(getProducts)
    .post(
        protect,
        authorize('admin'),
        upload.array('images', 5),
        validators.createProduct,
        validateRequest,
        createProduct
    );

router
    .route('/:id')
    .get(getProduct)
    .put(
        protect,
        authorize('admin'),
        upload.array('images', 5),
        validators.updateProduct,
        validateRequest,
        updateProduct
    )
    .delete(
        protect,
        authorize('admin'),
        validators.validateId,
        validateRequest,
        deleteProduct
    );

module.exports = router;
