const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

// Payment routes
router.post('/create-order', verifyToken, paymentController.createPaymentOrder);
router.post('/webhook', paymentController.paymentWebhook);
router.get('/return', paymentController.paymentReturn);
router.get('/status', verifyToken, paymentController.getPaymentStatus);
router.post('/refund', verifyToken, paymentController.refundPayment);

module.exports = router; 