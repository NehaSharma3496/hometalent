const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory/inventoryController');
const { verifyToken } = require('../middleware/authMiddleware');

// Inventory routes
router.post('/create', verifyToken, inventoryController.createInventory);
router.post('/getInventorydetail', verifyToken, inventoryController.getInventorydetail);
router.get('/getStoredata', verifyToken, inventoryController.getStoredata);
router.post('/getProductdata', verifyToken, inventoryController.getProductdata);
router.get('/store/:storeId', verifyToken, inventoryController.getStoreInventory);
router.put('/:id', verifyToken, inventoryController.updateInventory);
router.delete('/:id', verifyToken, inventoryController.deleteInventory);
router.get('/low-stock', verifyToken, inventoryController.getLowStockItems);
router.post('/restock/:id', verifyToken, inventoryController.restockInventory);
router.post('/updateInventoryquantity', verifyToken, inventoryController.updateInventoryquantity);

module.exports = router; 