const express = require('express');

const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const storeRoutes = require('./storeRoutes');
const variantsRoutes = require('./variantRoutes');

const orderRoutes = require('./orderRoutes'); // Import order routes



const router = express.Router();

// Use user routes
router.use('/', authRoutes);
router.use('/', postRoutes);
// Use category routes
router.use('/categories/', categoryRoutes);
// Use product routes
router.use('/products', productRoutes);
// Use variant routes
router.use('/variants', variantsRoutes);
// Use inventory routes
router.use('/inventory', inventoryRoutes);
// Use store routes
router.use('/stores', storeRoutes);
// Use order routes
router.use('/orders', orderRoutes); // Add this line to use order routes


module.exports = router;