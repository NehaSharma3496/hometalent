const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor/vendorController');

router.get('/categories', vendorController.listCategories);
router.get('/states', vendorController.listStates);
router.get('/cities', vendorController.listCitiesByState); // use query param ?state_id=

module.exports = router;
