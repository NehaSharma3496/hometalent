const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const adminGalleryController = require('../controllers/admin/adminGalleryController');
const authController = require('../controllers/auth/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/UploadMedia');
const galleryUpload = require('../middleware/GalleryUpload');

// 🧑‍💼 1. All Vendors
router.get('/vendors', adminController.listAllVendors);

// 🔍 2. Approve Listings (status = 0)
router.get('/vendors/pending', adminController.listPendingVendors);

router.get('/vendors/rejected', adminController.listRejectedVendors);

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

// Profile update request routes
router.get('/profile-update-requests', adminController.getAllProfileUpdateRequests);
router.get('/profile-update-requests/pending', adminController.getPendingProfileUpdateRequests);
router.get('/profile-update-requests/:request_id', adminController.getProfileUpdateRequestDetails);
router.post('/profile-update-requests/process', adminController.processProfileUpdateRequest);

// Gallery management routes
router.get('/gallery-requests', adminGalleryController.getAllGalleryRequests);
router.get('/gallery-requests/pending', adminGalleryController.getPendingGalleryRequests);
router.post('/gallery-requests/process', adminGalleryController.processGalleryRequest);

// User profile routes
router.get('/user-profile/:user_id', adminGalleryController.getUserCompleteProfile);

// Admin Gallery routes (no approval needed)
router.post('/admin-gallery/upload', galleryUpload, adminGalleryController.uploadAdminGalleryFiles);
router.get('/admin-gallery/my-gallery', adminGalleryController.getAdminGallery);
router.delete('/admin-gallery/remove/:gallery_id', adminGalleryController.removeAdminGalleryItem);
router.put('/admin-gallery/update-order', adminGalleryController.updateAdminGalleryOrder);
router.get('/admin-gallery/all', adminGalleryController.getAllAdminGalleries);

// Package Master CRUD
router.post('/package', adminController.createPackage);
router.get('/package', adminController.getAllPackages);
router.get('/package/:id', adminController.getPackageById);
router.put('/package/:id', adminController.updatePackage);
router.delete('/package/:id', adminController.deletePackage);
router.post('/package/update-status', adminController.updatePackageStatus);
router.post('/package/extend-vendor', adminController.extendVendorPackage);

// Expired Vendors
router.get('/expired-vendors', adminController.getExpiredVendors);
router.get('/notify-expired-plans', adminController.notifyExpiredPlans);

router.get('/leads', adminController.getAllLeads);
router.get('/sponsored-vendors-with-categories', adminController.getAllSponsoredVendorsWithCategories);
router.get('/contact-us', adminController.getAllContactUs);

// Dashboard summary counts
router.get('/dashboard-counts', adminController.getDashboardCounts);
router.post('/getprofileRequestdata', adminController.getprofileRequestdata)
router.post('/packageextendhistory', adminController.packageextendhistory)




module.exports = router;
