const express = require('express');
const router = express.Router();
const productController = require('../controllers/product/productController');
const { verifyToken } = require('../middleware/authMiddleware');

// Product routes
router.post('/create', verifyToken, productController.createProduct);
router.post('/list', verifyToken, productController.getAllProducts);

router.post('/updateProductStatus', verifyToken, productController.updateProductStatus);
router.post('/getExportAllProducts', verifyToken, productController.getExportAllProducts);


router.get('/:id', verifyToken, productController.getProductById);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);
router.get('/category/:categoryId', verifyToken, productController.getProductsByCategory);


// Product Variant routes
router.post('/:productId/variants', verifyToken, productController.addProductVariant);
router.get('/:productId/variants', verifyToken, productController.getProductVariants);
router.put('/variants/:variantId', verifyToken, productController.updateProductVariant);
router.delete('/variants/:variantId', verifyToken, productController.deleteProductVariant);

module.exports = router; 