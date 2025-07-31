const express = require('express');

const authRoutes = require('./authRoutes');
const vendorRoutes = require('./vendorRoutes');
const frontRoutes = require('./frontRoutes');
const adminRoutes = require('./adminRoutes');
const galleryRoutes = require('./galleryRoutes');
const clientRoutes = require('./clientRoutes');
const blogRoutes = require('./blogRoutes'); 

const router = express.Router();
// Use user routes
router.use('/', authRoutes);
router.use('/vendor', vendorRoutes);
router.use('/front', frontRoutes);
router.use('/admin', adminRoutes);
router.use('/gallery', galleryRoutes);
router.use('/client', clientRoutes);
router.use('/', blogRoutes);

module.exports = router;