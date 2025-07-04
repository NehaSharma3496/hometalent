const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route to Login
router.post('/login', authController.login);

// Route to create a new user
router.post('/addVendor', uploadMedia, authController.createUser);
// router.post('/getUser', verifyToken, authController.getUser);
// router.post('/editUser', verifyToken, authController.editUser);
// router.post('/updateUserStatus', verifyToken, authController.updateUserStatus);
// router.post('/deleteUser', verifyToken, authController.deleteUser);
// router.post('/exportUser', verifyToken, authController.exportUser);

// router.post('/setPassword', authController.setPassword);


// // Role
// router.get('/getAllRoles', authController.getAllRoles);






module.exports = router;
