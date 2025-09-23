const express = require('express');

const authRoutes = require('./authRoutes');
const vendorRoutes = require('./vendorRoutes');
const frontRoutes = require('./frontRoutes');
const adminRoutes = require('./adminRoutes');
const galleryRoutes = require('./galleryRoutes');
const paymentRoutes = require('./paymentRoutes');
const blogRoutes = require('./blogRoutes');
const reviewRoutes = require('./reviewRoutes');
const notificationRoutes = require('./notificationRoutes');
const employeeRoutes = require('./employeeRoutes');


const router = express.Router();

// Use user routes
router.use('/', authRoutes);
router.use('/vendor', vendorRoutes);
router.use('/front', frontRoutes);
router.use('/admin', adminRoutes);
router.use('/gallery', galleryRoutes);
router.use('/client', require('./clientRoutes'));
router.use('/payment', paymentRoutes);
router.use('/', blogRoutes);
router.use('/', reviewRoutes);
router.use('/', notificationRoutes);
router.use('/employee', employeeRoutes);


module.exports = router;