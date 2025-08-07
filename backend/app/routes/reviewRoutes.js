const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/front/review.controller');

// Create Review
router.post('/review', reviewController.createReview);

// Approve or Reject Review
router.put('/review/:id/approve', reviewController.approveOrRejectReview);

// Get All Reviews (Admin)
router.get('/reviews', reviewController.getAllReviews);

router.get('/reviews/active-approved', reviewController.getActiveApprovedReviews);

module.exports = router;