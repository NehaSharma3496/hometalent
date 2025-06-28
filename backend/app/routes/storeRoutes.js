const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store/storeController');
const { verifyToken } = require('../middleware/authMiddleware');

// Store routes
router.post('/create', verifyToken, storeController.createStore);
router.post('/list', verifyToken, storeController.getAllStores);
router.post('/exportStoreslist', verifyToken, storeController.exportStoreslist);
router.post('/updateStoreStatus', verifyToken, storeController.updateStoreStatus);

router.get('/:id', verifyToken, storeController.getStoreById);
router.put('/:id', verifyToken, storeController.updateStore);
router.delete('/:id', verifyToken, storeController.deleteStore);
router.get('/nearby', verifyToken, storeController.getNearbyStores);

module.exports = router; 