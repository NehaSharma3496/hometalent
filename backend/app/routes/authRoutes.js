const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/UploadMedia');

// Route to Login
router.post('/login', authController.login);
router.post('/addUser', uploadMedia, authController.createUser);







module.exports = router;
