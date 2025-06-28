const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variant/variantController');
const { verifyToken } = require('../middleware/authMiddleware');

// variant routes
router.post('/createVariant', verifyToken, variantController.createVariant);
router.post('/getAllVariants', verifyToken, variantController.getAllVariants);
router.get('/:id/getVariantById', verifyToken, variantController.getVariantById);
router.put('/updateVariant/:id', verifyToken, variantController.updateVariant);
router.delete('/deleteVariant/:id', verifyToken, variantController.deleteVariant);
router.put('/updateVariantStatus', verifyToken, variantController.updateVariantStatus);
router.post('/getExportAllVariants', verifyToken, variantController.getExportAllVariants);

module.exports = router; 