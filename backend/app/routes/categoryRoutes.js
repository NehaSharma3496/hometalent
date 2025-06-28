const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category/categoryController');
const { verifyToken } = require('../middleware/authMiddleware');

// Category routes
router.post('/create', verifyToken, categoryController.createCategory);
router.post('/list', verifyToken, categoryController.getAllCategories);
router.get('/getParentCategory', categoryController.getParentCategory);
router.get('/listServiceType', categoryController.listServiceType);
router.post('/updateCategoryStatus', categoryController.updateCategoryStatus);
router.post('/exportAllCategories', categoryController.exportAllCategories);
router.get('/getCategory', categoryController.getCategory);

router.get('/:id', verifyToken, categoryController.getCategoryById);
router.put('/:id', verifyToken, categoryController.updateCategory);
router.delete('/:id', verifyToken, categoryController.deleteCategory);
router.get('/subcategories/:id', verifyToken, categoryController.getSubcategories);



module.exports = router; 