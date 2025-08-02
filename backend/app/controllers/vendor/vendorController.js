const {
  Category,
  State,
  City,
  User,
  ProfileUpdateRequest,
  Package,
  VendorPackageSubscription,
  Log,
  ClientLead,
} = require("../../models"); // adjust path as needed
const { commonEmail } = require("../../helper/commonEmail");
const { Op } = require("sequelize");

exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [["id", "ASC"]] });
    res.json({ status: true, data: categories });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.listStates = async (req, res) => {
  try {
    const states = await State.findAll({ order: [["id", "ASC"]] });
    res.json({ status: true, data: states });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.listCitiesByState = async (req, res) => {
  try {
    const { state_id } = req.query;
    if (!state_id) {
      return res
        .status(400)
        .json({ status: false, msg: "state_id is required" });
    }

    const cities = await City.findAll({
      where: { state_id },
      order: [["id", "ASC"]],
    });

    res.json({ status: true, data: cities });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Request profile update - vendor submits changes for admin approval
exports.requestProfileUpdate = async (req, res) => {
  try {
    const vendor_id = req.body.vendor_id; // Get from authenticated user
    const updateData = req.body;

    // Only allow certain fields to be updated
    const allowedFields = [
      "owner_name",
      "profile_name",
      "state_id",
      "city_id",
      "pin_code",
      "phone",
      "email",
      "price_range",
      "short_description",
      "category_id",
      "experience_since",
      "long_description",
      "facebook_link",
      "instagram_link",
      "twitter_link",
      "linkedin_link",
      "youtube_link",
      "website_link",
      "image",
    ];

    const filteredData = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    // Handle uploaded files
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        filteredData.image = req.files.image[0].filename ? `${baseUrl}/media/${req.files.image[0].filename}` : null;
      }
    }

    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No valid fields provided for update",
      });
    }

    // Check if vendor already has a pending request
    const existingRequest = await ProfileUpdateRequest.findOne({
      where: {
        vendor_id,
        status: "pending",
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        status: false,
        msg: "You already have a pending profile update request. Please wait for admin approval.",
      });
    }

    // Create new profile update request
    const profileUpdateRequest = await ProfileUpdateRequest.create({
      vendor_id,
      request_data: filteredData,
      status: "pending",
    });

    // Log the request
    await Log.create({
      request_id: profileUpdateRequest.id,
      user_id: vendor_id,
      user_type: "vendor",
      action: "profile_update_request",
      details: JSON.stringify(filteredData),
    });

    return res.json({
      status: true,
      msg: "Profile update request submitted successfully. Waiting for admin approval.",
      data: {
        requested_changes: filteredData,
      },
    });
     
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Get vendor's profile update request status
exports.getProfileUpdateStatus = async (req, res) => {
  try {
    const { vendor_id } = req.query;

    if (!vendor_id) {
      return res.status(400).json({
        status: false,
        msg: "vendor_id is required",
      });
    }

    const requests = await ProfileUpdateRequest.findAll({
      where: { vendor_id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "admin",
          attributes: ["id", "owner_name", "profile_name"],
        },
      ],
    });

    res.json({
      status: true,
      data: requests,
    });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.getAvailablePackages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: packages } = await Package.findAndCountAll({
      where: { status: 1 },
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: true,
      data: packages,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_records: count,
        limit,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

// exports.subscribePackage = async (req, res) => 
//   try {
//     const { vendor_id, package_id, payment_reference } = req.body;
//     if (!vendor_id || !package_id || !payment_reference) {
//       return res.status(400).json({ status: false, msg: 'vendor_id, package_id, and payment_reference are required' });
//     }
//     const pkg = await Package.findByPk(package_id);
//     if (!pkg) return res.status(404).json({ status: false, msg: 'Package not found' });

//     // Find latest running subscription
//     const now = new Date();
//     const runningSub = await VendorPackageSubscription.findOne({
//       where: {
//         vendor_id,
//         payment_status: 'completed',
//         end_date: { [Op.gte]: now }
//       },
//       order: [['end_date', 'DESC']]
//     });

//     let startDate, endDate;
//     const validityDays = pkg.validity_in_months * 30;
//     if (runningSub) {
//       // Start from next day after current end_date
//       startDate = new Date(runningSub.end_date);
//       startDate.setDate(startDate.getDate() + 1);
//     } else {
//       startDate = now;
//     }
//     endDate = new Date(startDate);
//     endDate.setDate(endDate.getDate() + validityDays - 1); // -1 so 1 month = 30 days, 12 months = 360 days

//     const subscription = await VendorPackageSubscription.create({
//       vendor_id,
//       package_id,
//       start_date: startDate,
//       end_date: endDate,
//       payment_status: 'completed',
//       payment_reference
//     });
//     res.json({ status: true, data: subscription });
//   } catch (error) {
//     res.status(500).json({ status: false, msg: error.message });
//   }
// };

exports.subscribePackage = async (req, res) => {
  try {
    const { vendor_id, status, amount, package_id, payment_reference } = req.body;

    if (!vendor_id || !package_id || !payment_reference) {
      return res
        .status(400)
        .json({
          status: false,
          msg: "vendor_id, package_id, and payment_reference are required",
        });
    }

    const pkg = await Package.findByPk(package_id);

    if (!pkg)
      return res.status(404).json({ status: false, msg: "Package not found" });

    // ✅ Find latest subscription (past or future)

    const latestSub = await VendorPackageSubscription.findOne({
      where: {
        vendor_id,

        payment_status: "completed",
      },

      order: [["end_date", "DESC"]],
    });

    const now = new Date();

    let startDate;

    const validityDays = pkg.validity_in_months * 30;

    if (latestSub) {
      const latestEndDate = new Date(latestSub.end_date);

      // if latest subscription ends in future, start from next day

      startDate = new Date(latestEndDate.setDate(latestEndDate.getDate() + 1));
    } else {
      startDate = now;
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + validityDays - 1);

    const subscription = await VendorPackageSubscription.create({
      vendor_id,

      package_id,

      amount,

      start_date: startDate,

      end_date: endDate,

      payment_status: status,

      payment_reference,
    });

    res.json({ status: true, data: subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: error.message });
  }
};


exports.getMyLeads = async (req, res) => {
  try {
    const { vendor_id } = req.query;
    if (!vendor_id) {
      return res
        .status(400)
        .json({ status: false, msg: "vendor_id is required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: leads } = await ClientLead.findAndCountAll({
      where: { vendor_id },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: true,
      data: leads,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_records: count,
        limit,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.getPackageHistory = async (req, res) => {
  try {
    const { vendor_id, payment_status, package_id } = req.query;
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    if (!vendor_id) {
      return res
        .status(400)
        .json({ status: false, msg: "vendor_id is required" });
    }
    const where = { vendor_id };
    if (payment_status) where.payment_status = payment_status;
    if (package_id) where.package_id = package_id;
    const { count, rows } = await VendorPackageSubscription.findAndCountAll({
      where,
      include: [
        {
          model: Package,
          as: "Package",
          required: true,
        },
      ],
      order: [["start_date", "DESC"]],
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    res.json({
      status: true,
      data: rows,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_records: count,
        limit,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};
