const { Review, Notification, Report, User }  = require('../../models');
const socketManager = require('../../socket/socketManager');
const fetch = require("node-fetch");

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { vendor_id, name, email, phone, message, rating } = req.body;

    if (!name || !message) {
      return res.status(400).json({ status: false, message: 'Name and message are required' });
    }
    
    const checkphone = phone ? await Review.findOne({ where: { phone, vendor_id } }) : null;
    if (checkphone) {
      return res.status(400).json({ status: false, message: 'You have already submitted a review to this vendor' });
    }
    const review = await Review.create({ vendor_id, name, email, phone, message, rating });
    // Emit and persist admin notification
    try {
      socketManager.reviewSubmitted({ id: review.id, name: review.name, message: review.message });
      await Notification.create({
        user_id: null,
        user_type: 'admin',
        type: 'review_submitted',
        title: 'New Review',
        message: 'New review has been received.',
        metadata: { id: review.id }
      });
    } catch (e) { console.error('Failed to notify/persist review submission:', e.message); }

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
    // Get page & limit from request query, set defaults
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const offset = (page - 1) * limit;

    // Fetch reviews with pagination
    const { count, rows: reviews } = await Review.findAndCountAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'User', attributes: ['owner_name'] }],
      limit,
      offset,
    });

    return res.status(200).json({
      status: true,
      data: reviews,
      pagination: {
        totalRecords: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error fetching reviews',
      error: error.message,
    });
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

exports.createReport = async (req, res) => {
  try {
    const { vendor_id, name, phone, reason } = req.body;
    if (!name || !reason) {
      return res.status(400).json({ status: false, message: 'Name and reason are required' });
    }
   
    const report = await Report.create({ vendor_id, name, phone, reason });
    // Emit and persist admin notification
    try {
      socketManager.reviewSubmitted({ id: report.id, name: report.name, reason: report.reason });
      await Notification.create({
        user_id: null,
        user_type: 'admin',
        type: 'report_submitted',
        title: 'New Report',
        message: 'New report has been received.',
        metadata: { id: report.id }
      });
    } catch (e) { console.error('Failed to notify/persist report submission:', e.message); }

    return res.status(201).json({ status: true, message: 'Report submitted successfully', data: report });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error submitting report', error: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    // Get page & limit from request query, set defaults
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const offset = (page - 1) * limit;

    // Fetch reports with pagination
    const { count, rows: reports } = await Report.findAndCountAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'User', attributes: ['owner_name'] }],
      limit,
      offset,
    });

    return res.status(200).json({
      status: true,
      data: reports,
      pagination: {
        totalRecords: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error fetching reports',
      error: error.message,
    });
  }
};


function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000); // ensures 4 digits
}

exports.sendotpreview = async (req, res) => {
  try {
    if(req.body.type == 'review'){
      const checkphone = await Review.findOne({ where: { phone: req.body.phone } });
      if (checkphone) {
        return res.status(400).json({ status: false, msg: "Already verify" });
      }
    }else{
      const checkphone = await Report.findOne({ where: { phone: req.body.phone } });
      if (checkphone) {
        return res.status(400).json({ status: false, msg: "Already verify" });
      }
    }
    
    let otp = generateOtp();
    const message = `Cegano Technology: Your OTP is ${otp}. Please enter this code to complete your login or signup. Do not share this code with anyone.`;
    const url = new URL("http://smsjust.com/sms/user/urlsms.php");
    url.search = new URLSearchParams({
      username: "hometalent",
      pass: "$4J@K2pj",
      senderid: "CEGANO",
      message: message,
      dest_mobileno: req.body.phone,
      msgtype: "TXT",
      response: "Y",
      dlttempid: "1707175612278037393"
    });

    const response = await fetch(url);
    const text = await response.text();
    return res.json({ status: true, msg: "otp send successfully", otp: otp });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};






