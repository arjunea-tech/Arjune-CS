const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
} = require('../controllers/products');

const { upload } = require('../utils/storage');
const { protect, authorize } = require('../middleware/auth');
const { validators, validateRequest } = require('../utils/validation');

const router = express.Router();

// Search route (must be before :id routes)
router.get('/search/query', searchProducts);

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
