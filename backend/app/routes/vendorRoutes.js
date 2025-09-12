const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor/vendorController');
const uploadMedia = require('../middleware/UploadMedia');

router.get('/categories', vendorController.listCategories);
router.get('/states', vendorController.listStates);
router.get('/cities', vendorController.listCitiesByState); // use query param ?state_id=
router.get('/packages', vendorController.getAvailablePackages);
router.get('/my-leads', vendorController.getMyLeads);
router.get('/package-history', vendorController.getPackageHistory);

// Profile update request routes
router.post('/profile-update-request', uploadMedia, vendorController.requestProfileUpdate);
router.get('/profile-update-status', vendorController.getProfileUpdateStatus);
router.post('/subscribe-package', vendorController.subscribePackage);
router.post('/dashboard-counts', vendorController.getDashboardCounts);
router.get('/rating_average/:vendor_id', vendorController.vendoraverageRating);
module.exports = router;
