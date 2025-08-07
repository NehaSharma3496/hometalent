const { Review }  = require('../../models');

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ status: false, message: 'Name and message are required' });
    }

    const review = await Review.create({ name, message });
    return res.status(201).json({ status: true, message: 'Review submitted successfully', data: review });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error submitting review', error: error.message });
  }
};

// Approve or Reject a review
exports.approveOrRejectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { approve_status } = req.body;

    if (![0, 1].includes(approve_status)) {
      return res.status(400).json({ status: false, message: 'Invalid approve_status. Must be 0 or 1' });
    }

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ status: false, message: 'Review not found' });
    }

    review.approve_status = approve_status;
    await review.save();

    return res.status(200).json({ status: true, message: `Review has been ${approve_status === 1 ? 'approved' : 'rejected'}` });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error updating review status', error: error.message });
  }
};

// Get all reviews (admin view)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ status: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error fetching reviews', error: error.message });
  }
};

// Get only active and approved reviews (public view)
exports.getActiveApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: {
        status: 1,
        approve_status: 1
      },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ status: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error fetching reviews', error: error.message });
  }
};
