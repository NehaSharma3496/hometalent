const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/notifications/admin', notificationController.listAdminNotifications);
router.get('/notifications/vendor/:vendor_id', notificationController.listVendorNotifications);
router.patch('/notifications/:id/read', notificationController.markAsRead);

module.exports = router;