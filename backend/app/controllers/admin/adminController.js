const {
  User,
  Category,
  ProfileUpdateRequest,
  Package,
  VendorPackageSubscription,
  Log,
  ClientLead,
  VendorCategoryRank,
  ContactUs,
} = require("../../models"); // adjust path as needed
const { commonEmail } = require("../../helper/commonEmail");
const { Op, Sequelize } = require('sequelize');

exports.listAllVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: vendors } = await User.findAndCountAll({
      where: { role_id: 2 },
      order: [["createdAt", "DESC"]],
      raw: true,
      limit,
      offset,
    });

    // Get all unique category IDs
    const categoryIds = [
      ...new Set(
        vendors.flatMap((v) =>
          v.category_id
            ? v.category_id.split(",").map((id) => parseInt(id.trim()))
            : []
        )
      ),
    ];

    // Fetch category names
    const categories = await Category.findAll({
      where: { id: categoryIds },
      raw: true,
    });

    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.id, c.name])
    );

    // Attach category names to each vendor
    const enrichedVendors = vendors.map((v) => ({
      ...v,
      category_names: (v.category_id || "")
        .split(",")
        .map((id) => categoryMap[parseInt(id.trim())])
        .filter(Boolean),
    }));

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: true,
      data: enrichedVendors,
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
    res.json({ status: false, msg: error.message });
  }
};

exports.listPendingVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: vendors } = await User.findAndCountAll({
      where: { role_id: 2, approval_status: 0 },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: true,
      data: vendors,
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
    res.json({ status: false, msg: error.message });
  }
};

exports.listRejectedVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: vendors } = await User.findAndCountAll({
      where: { role_id: 2, approval_status: 2 },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: true,
      data: vendors,
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
    res.json({ status: false, msg: error.message });
  }
};

exports.listSponsoredVendors = async (req, res) => {
  try {
    const { category_id } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let whereCondition = { is_sponsored: 1 };
    if (category_id) whereCondition.category_id = category_id;

    // Get sponsored vendors
    const { count, rows: sponsoredRows } =
      await VendorCategoryRank.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: User,
            as: "vendor",
            attributes: [
              "id",
              "owner_name",
              "profile_name",
              "email",
              "phone",
              "status",
            ],
          },
          { model: Category, as: "category", attributes: ["id", "name"] },
        ],
        order: [["sponsor_rank", "ASC"]],
        limit,
        offset,
      });

    // Get all sponsored vendor IDs
    const sponsoredVendorIds = sponsoredRows.map((r) => r.vendor_id);

    // Get remaining active vendors (not sponsored, status=1)
    const activeVendors = await User.findAll({
      where: {
        category_id : { [Op.like]: `%${category_id}%` },
        role_id: 2,
        status: 1,
        id: { [require("sequelize").Op.notIn]: sponsoredVendorIds },
      },
      attributes: [
        "id",
        "owner_name",
        "profile_name",
        "email",
        "phone",
        "status",
      ],
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: true,
      sponsored: sponsoredRows,
      remaining_active: activeVendors,
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

exports.listBlockedVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: vendors } = await User.findAndCountAll({
      where: { role_id: 2, status: 2 },
      order: [["updatedAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: true,
      data: vendors,
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
    res.json({ status: false, msg: error.message });
  }
};

exports.updateVendorStatus = async (req, res) => {
  try {
    const { vendor_id, status } = req.body; // status = 1 (approve), 2 (block), 0 (unapprove)

    if (![0, 1, 2].includes(Number(status))) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid status value" });
    }

    const vendor = await User.findOne({ where: { id: vendor_id, role_id: 2 } });
    if (!vendor) {
      return res.json({ status: false, msg: "Vendor not found" });
    }

    vendor.status = status;
    await vendor.save();

    res.json({ status: true, msg: `Vendor status updated` });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.approveVendor = async (req, res) => {
  try {
    const { vendor_id, approval} = req.body;
    if (!vendor_id) {
      return res
        .status(400)
        .json({ status: false, msg: "vendor_id is required" });
    }

    const vendor = await User.findOne({ where: { id: vendor_id, role_id: 2 } });
    if (!vendor) {
      return res.json({ status: false, msg: "Vendor not found" });
    }

    // Update status to approved
    vendor.approval_status = approval;
    await vendor.save();

    // Send email with login credentials
    const subject = "Vendor Approved - Login Details";
    const message = `
      <p>Hi ${vendor.owner_name || vendor.profile_name || "Vendor"},</p>
      <p>Your profile has been approved by admin. You can now log in using either your <strong>email</strong> or <strong>mobile number</strong>.</p>
      <p><strong>Login Email:</strong> ${vendor.email}</p>
      <p><strong>Login Mobile:</strong> ${vendor.phone}</p>
      <p><strong>Password:</strong> ${vendor.show_password}</p>
      <p>Click here to login: <a href="http://localhost:3000/login">Login</a></p> 
      <p>Thank you,<br/>Team HomeTalent</p>
    `;

    await commonEmail(vendor.email, subject, message);

    res.json({
      status: true,
      msg: "Vendor approved and login details sent via email",
    });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.active_vendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: vendors } = await User.findAndCountAll({
      where: {
        role_id: 2,
        status: 1,
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: true,
      data: vendors,
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
    res.json({ status: false, msg: error.message });
  }
};

exports.updateSponsorRanks = async (req, res) => {
  try {
    const { vendors } = req.body;

    if (!Array.isArray(vendors) || vendors.length === 0) {
      return res
        .status(400)
        .json({ status: false, msg: "vendors array is required" });
    }

    // Validate all entries
    for (const v of vendors) {
      if (
        !v.vendor_id ||
        !v.category_id ||
        typeof v.sponsor_rank !== "number"
      ) {
        return res
          .status(400)
          .json({
            status: false,
            msg: "Each item must include vendor_id, category_id, and sponsor_rank",
          });
      }
    }

    // Update vendor category ranks one by one
    for (const v of vendors) {
      // Use upsert to create or update the rank
      await VendorCategoryRank.upsert({
        vendor_id: v.vendor_id,
        category_id: v.category_id,
        sponsor_rank: v.sponsor_rank,
        is_sponsored: v.sponsor_rank > 0 ? 1 : 0,
      });
    }

    res.json({
      status: true,
      msg: "Category-specific sponsor ranks updated successfully",
    });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Get all pending profile update requests
exports.getPendingProfileUpdateRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: requests } =
      await ProfileUpdateRequest.findAndCountAll({
        where: { status: "pending" },
        order: [["createdAt", "ASC"]],
        include: [
          {
            model: User,
            as: "vendor",
            attributes: [
              "id",
              "owner_name",
              "profile_name",
              "email",
              "phone",
              "status",
            ],
          },
        ],
        limit,
        offset,
      });

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: true,
      data: requests,
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
    res.json({ status: false, msg: error.message });
  }
};

// Get specific profile update request details
exports.getProfileUpdateRequestDetails = async (req, res) => {
  try {
    const { request_id } = req.params;

    const request = await ProfileUpdateRequest.findOne({
      where: { id: request_id },
      include: [
        {
          model: User,
          as: "vendor",
          attributes: [
            "id",
            "owner_name",
            "profile_name",
            "email",
            "phone",
            "status",
            "state_id",
            "city_id",
            "pin_code",
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
          ],
        },
        {
          model: User,
          as: "admin",
          attributes: ["id", "owner_name", "profile_name"],
        },
      ],
    });

    if (!request) {
      return res.json({
        status: false,
        msg: "Profile update request not found",
      });
    }

    // // Debug: Log the request data
    // console.log("Request ID:", request_id);
    // console.log("Request Data Type:", typeof request.request_data);
    // console.log("Request Data:", request.request_data);
    // console.log("Vendor ID:", request.vendor_id);

    res.json({
      status: true,
      data: request,
    });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Approve or reject profile update request
exports.processProfileUpdateRequest = async (req, res) => {
  try {
    const { request_id, action, remarks, admin_id } = req.body; // action: 'approve' or 'reject'

    if (!admin_id) {
      return res.json({
        status: false,
        msg: "admin_id is required",
      });
    }

    if (!["approve", "reject"].includes(action)) {
      return res.json({
        status: false,
        msg: 'Action must be either "approve" or "reject"',
      });
    }

    const request = await ProfileUpdateRequest.findOne({
      where: { id: request_id, status: "pending" },
      include: [
        {
          model: User,
          as: "vendor",
          attributes: ["id", "email", "owner_name", "profile_name"],
        },
      ],
    });

    if (!request) {
      return res.json({
        status: false,
        msg: "Profile update request not found or already processed",
      });
    }

    // Update request status
    request.status = action === "approve" ? "approved" : "rejected";
    request.admin_id = admin_id;
    request.admin_remarks = remarks || "";
    request.processed_at = new Date();
    await request.save();

    if (action === "approve") {
      // Parse request_data if it's a string
      let updateData = request.request_data;
      if (typeof updateData === "string") {
        try {
          updateData = JSON.parse(updateData);
        } catch (error) {
          // console.error('Error parsing request_data:', error);
          return res.json({
            status: false,
            msg: "Invalid request data format",
          });
        }
      }

      // Debug: Log the update data
      // console.log('Updating user with data:', updateData);
      // console.log('Vendor ID:', request.vendor_id);

      // Get user data before update
      const userBefore = await User.findByPk(request.vendor_id);
      // console.log('User data before update:', userBefore ? userBefore.toJSON() : 'User not found');

      // Apply the changes to vendor profile
      const updateResult = await User.update(updateData, {
        where: { id: request.vendor_id },
      });

      // console.log('Update result:', updateResult);

      // Get user data after update
      const userAfter = await User.findByPk(request.vendor_id);
      // console.log('User data after update:', userAfter ? userAfter.toJSON() : 'User not found');

      // Send email notification to vendor
      const subject = "Profile Update Approved";
      const message = `
        <p>Hi ${
          request.vendor.owner_name || request.vendor.profile_name || "Vendor"
        },</p>
        <p>Your profile update request has been approved by admin.</p>
        <p><strong>Updated Fields:</strong></p>
        <ul>
          ${Object.keys(updateData)
            .map((key) => {
              if (key === "image" || key === "video") {
                return `<li>${key}: File uploaded successfully</li>`;
              }
              return `<li>${key}: ${updateData[key]}</li>`;
            })
            .join("")}
        </ul>
        ${remarks ? `<p><strong>Admin Remarks:</strong> ${remarks}</p>` : ""}
        <p>Thank you,<br/>Team HomeTalent</p>
      `;

      await commonEmail(request.vendor.email, subject, message);

      // Log the approval and approved data
      await Log.create({
        request_id,
        user_id: admin_id,
        user_type: "admin",
        action: "profile_update_approve",
        details: JSON.stringify({
          request_id,
          approved_data: updateData,
          vendor_id: request.vendor_id,
          user_before: userBefore,
          user_after: userAfter,
        }),
      });
    } else {
      // Send rejection email to vendor
      const subject = "Profile Update Request Rejected";
      const message = `
        <p>Hi ${
          request.vendor.owner_name || request.vendor.profile_name || "Vendor"
        },</p>
        <p>Your profile update request has been rejected by admin.</p>
        ${remarks ? `<p><strong>Reason:</strong> ${remarks}</p>` : ""}
        <p>Please review your request and submit again if needed.</p>
        <p>Thank you,<br/>Team HomeTalent</p>
      `;

      await commonEmail(request.vendor.email, subject, message);

      // Log the rejection and request data
      await Log.create({
        request_id,
        user_id: admin_id,
        user_type: "admin",
        action: "profile_update_reject",
        details: JSON.stringify({
          request_id,
          request_data: request.request_data,
          vendor_id: request.vendor_id,
          remarks,
        }),
      });
    }

    res.json({
      status: true,
      msg: `Profile update request ${action}d successfully`,
      data: {
        request_id: request.id,
        status: request.status,
        processed_at: request.processed_at,
      },
    });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Get all profile update requests (for admin dashboard)
exports.getAllProfileUpdateRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      whereClause.status = status;
    }

    const requests = await ProfileUpdateRequest.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: "vendor",
          attributes: ["id", "owner_name", "profile_name", "email", "phone"],
        },
        {
          model: User,
          as: "admin",
          attributes: ["id", "owner_name", "profile_name"],
        },
      ],
    });

    res.json({
      status: true,
      data: {
        requests: requests.rows,
        total: requests.count,
        current_page: parseInt(page),
        total_pages: Math.ceil(requests.count / limit),
      },
    });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Package Master CRUD APIs
exports.createPackage = async (req, res) => {
  try {
    const { name, description, price, validity_in_months, features, status } =
      req.body;
    const pkg = await Package.create({
      name,
      description,
      price,
      validity_in_months,
      features,
      status,
    });
    res.json({ status: true, data: pkg });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.getAllPackages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: pkgs } = await Package.findAndCountAll({
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: true,
      data: pkgs,
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

exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg)
      return res.status(404).json({ status: false, msg: "Package not found" });
    res.json({ status: true, data: pkg });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, validity_in_months, features, status } =
      req.body;
    const pkg = await Package.findByPk(id);
    if (!pkg)
      return res.status(404).json({ status: false, msg: "Package not found" });
    await pkg.update({
      name,
      description,
      price,
      validity_in_months,
      features,
      status,
    });
    res.json({ status: true, data: pkg });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await Package.findByPk(id);
    if (!pkg)
      return res.status(404).json({ status: false, msg: "Package not found" });
    await pkg.destroy();
    res.json({ status: true, msg: "Package deleted" });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.updatePackageStatus = async (req, res) => {
  try {
    const { package_id, status } = req.body;
    if (!package_id || typeof status === "undefined") {
      return res
        .status(400)
        .json({ status: false, msg: "package_id and status are required" });
    }
    if (![0, 1].includes(Number(status))) {
      return res
        .status(400)
        .json({
          status: false,
          msg: "status must be 0 (inactive) or 1 (active)",
        });
    }
    const pkg = await Package.findByPk(package_id);
    if (!pkg) {
      return res.status(404).json({ status: false, msg: "Package not found" });
    }
    pkg.status = status;
    await pkg.save();
    res.json({
      status: true,
      msg: `Package ${status == 1 ? "activated" : "inactivated"} successfully`,
    });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.getExpiredVendors = async (req, res) => {
  try {
    const today = new Date();
    // Find expired subscriptions
    const expiredSubs = await VendorPackageSubscription.findAll({
      where: {
        end_date: { [require("sequelize").Op.lt]: today },
        payment_status: "completed",
      },
      include: [
        {
          model: User,
          as: "vendor",
          attributes: ["id", "owner_name", "profile_name", "email", "phone"],
        },
      ],
      order: [["end_date", "DESC"]],
    });
    // Map to vendor details
    const expiredVendors = expiredSubs.map((sub) => ({
      vendor_id: sub.vendor_id,
      end_date: sub.end_date,
      ...((sub.vendor && sub.vendor.dataValues) || {}),
    }));
    res.json({ status: true, data: expiredVendors });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.extendVendorPackage = async (req, res) => {
  try {
    const { id, extra_days } = req.body;

    if (!id || !extra_days) {
      return res
        .status(400)
        .json({
          status: false,
          msg: "subscription_id and extra_days are required",
        });
    }

    const sub = await VendorPackageSubscription.findByPk(id);

    if (!sub) {
      return res
        .status(404)
        .json({ status: false, msg: "Subscription not found" });
    }

    const endDate = new Date(sub.end_date);

    endDate.setDate(endDate.getDate() + Number(extra_days));

    sub.end_date = endDate;

    await sub.save();

    res.json({
      status: true,
      msg: "Subscription end_date extended successfully",
      data: sub,
    });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: leads } = await ClientLead.findAndCountAll({
      include: [
        {
          model: User,
          as: "vendor",
          attributes: ["id", "owner_name", "profile_name", "email", "phone"],
        },
      ],
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

exports.getAllSponsoredVendorsWithCategories = async (req, res) => {
  try {
    const sponsored = await VendorCategoryRank.findAll({
      where: { is_sponsored: 1 },
      include: [
        {
          model: User,
          as: "vendor",
          attributes: ["id", "owner_name", "profile_name", "email", "phone"],
        },
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
      order: [
        ["category_id", "ASC"],
        ["sponsor_rank", "ASC"],
      ],
    });
    res.json({ status: true, data: sponsored });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.getAllContactUs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { count, rows } = await ContactUs.findAndCountAll({
      order: [["createdAt", "DESC"]],
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

// Dashboard counts for admin
exports.getDashboardCounts = async (req, res) => {
  try {
    const { Op } = require("sequelize");
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    // Total leads
    const totalLeads = await ClientLead.count();
    // Total vendors
    const totalVendors = await User.count({ where: { role_id: 2 } });
    // Pending vendors
    const pendingVendors = await User.count({
      where: { role_id: 2, status: 0 },
    });

    // Current month counts
    const leadsCurrentMonth = await ClientLead.count({
      where: { createdAt: { [Op.gte]: startOfCurrentMonth } },
    });
    const vendorsCurrentMonth = await User.count({
      where: { role_id: 2, createdAt: { [Op.gte]: startOfCurrentMonth } },
    });
    const pendingVendorsCurrentMonth = await User.count({
      where: {
        role_id: 2,
        status: 0,
        createdAt: { [Op.gte]: startOfCurrentMonth },
      },
    });

    // Previous month counts
    const leadsPrevMonth = await ClientLead.count({
      where: {
        createdAt: {
          [Op.gte]: startOfPrevMonth,
          [Op.lt]: startOfCurrentMonth,
        },
      },
    });
    const vendorsPrevMonth = await User.count({
      where: {
        role_id: 2,
        createdAt: {
          [Op.gte]: startOfPrevMonth,
          [Op.lt]: startOfCurrentMonth,
        },
      },
    });
    const pendingVendorsPrevMonth = await User.count({
      where: {
        role_id: 2,
        status: 0,
        createdAt: {
          [Op.gte]: startOfPrevMonth,
          [Op.lt]: startOfCurrentMonth,
        },
      },
    });

    // Percentage increase calculation helper
    function getPercentageIncrease(current, prev) {
      if (prev === 0) return current > 0 ? 100 : 0;
      return ((current - prev) / prev) * 100;
    }

    res.json({
      status: true,
      data: {
        total_leads: totalLeads,
        total_vendors: totalVendors,
        pending_vendors: pendingVendors,
        leads_percentage_increase: getPercentageIncrease(
          leadsCurrentMonth,
          leadsPrevMonth
        ),
        vendors_percentage_increase: getPercentageIncrease(
          vendorsCurrentMonth,
          vendorsPrevMonth
        ),
        pending_vendors_percentage_increase: getPercentageIncrease(
          pendingVendorsCurrentMonth,
          pendingVendorsPrevMonth
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.getprofileRequestdata = async (req, res) => {
  try {
    const { request_id } = req.body;

    if (!request_id){
      return res.status(400).json({ status: false, msg: 'request_id is required' });
    }

    const lastLog = await Log.findOne({
      where: { request_id },
      order: [['id', 'DESC']], // Or use ['id', 'DESC'] if `created_at` doesn't exist
    });

    if (!lastLog) {
      return res.status(404).json({ status: false, msg: 'No data found for this request_id' });
    }

    return res.json({
      status: true,
      data: lastLog,
    });

  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};