const express = require('express');

const authRoutes = require('./authRoutes');
const vendorRoutes = require('./vendorRoutes');
const frontRoutes = require('./frontRoutes');
const adminRoutes = require('./adminRoutes');
const galleryRoutes = require('./galleryRoutes');
const clientRoutes = require('./clientRoutes');
const blogRoutes = require('./blogRoutes');
const reviewRoutes = require('./reviewRoutes'); 

const router = express.Router();
// Use user routes
router.use('/', authRoutes);
router.use('/vendor', vendorRoutes);
router.use('/front', frontRoutes);
router.use('/admin', adminRoutes);
router.use('/gallery', galleryRoutes);
router.use('/client', clientRoutes);
router.use('/', blogRoutes);
router.use('/', reviewRoutes);

// Test socket connection
router.get('/socket-test', (req, res) => {
  res.json({ 
    status: true, 
    msg: 'Socket server is running. Connect to this server using Socket.IO client.',
    socket_url: `http://localhost:${process.env.PORT || 9999}`
  });
});

module.exports = router;