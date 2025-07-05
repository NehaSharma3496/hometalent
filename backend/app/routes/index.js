const express = require('express');

const authRoutes = require('./authRoutes');
const vendorRoutes = require('./vendorRoutes');

const router = express.Router();
// Use user routes
router.use('/', authRoutes);
router.use('/vendor', vendorRoutes);

module.exports = router;