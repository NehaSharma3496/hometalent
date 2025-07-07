const express = require('express');

const authRoutes = require('./authRoutes');
const vendorRoutes = require('./vendorRoutes');
const frontRoutes = require('./frontRoutes');

const router = express.Router();
// Use user routes
router.use('/', authRoutes);
router.use('/vendor', vendorRoutes);
router.use('/front', frontRoutes);

module.exports = router;