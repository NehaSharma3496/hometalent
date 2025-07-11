const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const authController = require('../controllers/auth/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// 🧑‍💼 1. All Vendors
router.get('/vendors', adminController.listAllVendors);

// 🔍 2. Approve Listings (status = 0)
router.get('/vendors/pending', adminController.listPendingVendors);

// ✅ Approve a vendor and email credentials
router.post('/vendors/approve', adminController.approveVendor);

// 💎 3. Sponsored Vendors
router.get('/vendors/sponsored', adminController.listSponsoredVendors);

// 🚫 4. Blocked Vendors
router.get('/vendors/blocked', adminController.listBlockedVendors);

// 🔁 Optional: Generic update status (0 = unapproved, 1 = approved, 2 = blocked)
router.post('/vendors/update-status', adminController.updateVendorStatus);

router.get('/active_vendors', adminController.active_vendors);


router.post('/update-sponsor-ranks', adminController.updateSponsorRanks);


module.exports = router;
