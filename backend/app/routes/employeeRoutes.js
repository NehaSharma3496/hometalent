const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const employeeController = require('../controllers/employee/employeeController');
const { verifyToken } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/UploadMedia');

// Route to Login
router.post('/addemployee', employeeController.addEmployee);
router.get('/list', employeeController.getEmployees);
router.post('/update/:id', uploadMedia, employeeController.updateEmployee);
router.delete('/delete/:id', employeeController.deleteEmployee);
router.post('/assign-permissions', employeeController.assignPermissions);
router.get('/get-employee-permissions/:user_id', employeeController.getEmployeePermissions);
router.get('/getallpermissions', employeeController.getallpermissions);
router.post('/checkEmployeePermission', employeeController.checkEmployeePermission);

module.exports = router;
