const express = require('express');
const router = express.Router();
const authController = require('../controllers/front/frontController');
const { verifyToken } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/uploadMedia');

// Route to Login
router.get('/state_city_list', authController.listStatesAndCities);

module.exports = router;
