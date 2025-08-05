const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/UploadMedia');

// Route to Login
router.post('/login', authController.login);
router.post('/addUser', uploadMedia, authController.createUser);
router.post('/addUser', uploadMedia, authController.createUser);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);
router.post('/change_password', authController.reset_password);










module.exports = router;
