const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

// Order routes
router.post('/create', verifyToken, orderController.createOrder);
router.get('/list', verifyToken, orderController.getAllOrders);
router.get('/:id', verifyToken, orderController.getOrderById);
router.put('/:id/status', verifyToken, orderController.updateOrderStatus);
router.get('/store/:storeId', verifyToken, orderController.getStoreOrders);
router.get('/vendor/:vendorId', verifyToken, orderController.getVendorOrders);

// Order routing and assignment
// router.post('/:orderId/assign', verifyToken, orderController.assignOrderToVendor);
router.post('/:orderId/accept', verifyToken, orderController.acceptOrder);
router.post('/:orderId/reject', verifyToken, orderController.rejectOrder);
router.get('/available/nearby', verifyToken, orderController.getAvailableOrdersNearby);

module.exports = router; 