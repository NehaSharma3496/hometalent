const express = require('express');
const router = express.Router();
const frontController = require('../controllers/front/frontController');
const { verifyToken } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/UploadMedia');

// Route to Login
router.get('/state_city_list', frontController.listStatesAndCities);
router.get('/vendors-by-category/:category_id?', frontController.getVendorsByCategoryId);

module.exports = router;
