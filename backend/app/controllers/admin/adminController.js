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
  Blog,
  Review,
  Notification,
  FeedBack,
  City,
  State
} = require("../../models"); // adjust path as needed
const { commonEmail } = require("../../helper/commonEmail");
const socketManager = require('../../socket/socketManager');
const fetch = require("node-fetch");
const { Op, Sequelize,literal,fn, col, where } = require('sequelize');
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

exports.listAllVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      include: [
        { model : City, attributes: ['id', 'name'] },
        { model : State, attributes: ['id', 'name'] }
      ],
      where: { role_id: 2 },
      order: [["createdAt", "DESC"]], 
      raw: true,
      limit,
      offset,
    });
    const vendors = rows.map(v => ({
      ...v,
      City: { id: v['City.id'], name: v['City.name'] },
      State: { id: v['State.id'], name: v['State.name'] }
    }));
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

    // Fetch category names (only numeric IDs)
    const numericCategoryIds = categoryIds.filter((id) => !isNaN(id));
    const categories = await Category.findAll({
      where: { id: numericCategoryIds },
      raw: true,
    });

    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.id, c.name])
    );

    // Attach category names to each vendor
    const enrichedVendors = vendors.map((v) => {
      const parts = (v.category_id || "").split(",").map((s) => s.trim()).filter(Boolean);
      const names = parts.map((part) => {
        if (part.startsWith("other:")) return part.slice(6);
        const idNum = parseInt(part);
        return categoryMap[idNum];
      }).filter(Boolean);
      return { ...v, category_names: names };
    });

    const totalPages = Math.ceil(count / limit);

    return res.json({
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
    return res.json({ status: false, msg: error.message });
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
  where: {
    ...whereCondition,
    [Op.and]: literal(`FIND_IN_SET(VendorCategoryRank.category_id, vendor.category_id)`)
  },
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
        "category_id" // make sure to include this to use in FIND_IN_SET
      ],
      include: [
        {
          model: City,
          attributes: ["id", "name"]
        },
          {
          model: State,
          attributes: ["id", "name"]
        }
      ]
    },
    {
      model: Category,
      as: "category",
      attributes: ["id", "name"]
    }

  ],
  order: [["sponsor_rank", "ASC"]],
  limit,
  offset,
});

    // Get all sponsored vendor IDs
    const sponsoredVendorIds = sponsoredRows.map((r) => r.vendor_id);

    const activeVendors = await User.findAll({
      where: {
        [Op.and]: [
      {
        [Op.or]: [
          { category_id: category_id }, // Exact match
          { category_id: { [Op.like]: `%,${category_id},%` } }, // Middle
          { category_id: { [Op.like]: `${category_id},%` } },   // Start
          { category_id: { [Op.like]: `%,${category_id}` } }    // End
        ]
      },
      { role_id: 2 },
      { status: 1 },
      { id: { [Op.notIn]: sponsoredVendorIds } }
    ],
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
      where: { role_id: 2, status: 2, approval_status: 1 },
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
    const { vendor_id, blog_id, review_id, status, login_id } = req.body; // status = 1 (approve), 2 (block), 0 (unapprove)
    const vendor = await User.findOne({ where: { id: vendor_id, role_id: 2 } });
    const loginuser = await User.findOne({ where: { id: login_id, role_id: {
            [Op.or]: [1, 3]
          } } });
    if (!vendor) {
      return res.json({ status: false, msg: "Vendor not found" });
    }
    if (![0, 1, 2].includes(Number(status))) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid status value" });
    }
    let data
    if (vendor_id && vendor_id !== undefined) {
      data = await User.findOne({
        where: {
          id: vendor_id,
          role_id: {
            [Op.or]: [2, 3]
          }
        }
      });
    }
    if(blog_id && blog_id !== undefined ) {
      data = await Blog.findOne({ where: { id: blog_id } });
    }
    if(review_id && review_id !== undefined ) {
      data = await Review.findOne({ where: { id: review_id } });
    }
    if (!data) {
      return res.json({ status: false, msg: "Record not found" });
    }

    data.status = status;
    await data.save();
    let action;
      if(status == 1){
        action = "Activated";
      }else{
        action = "Deactivated";
      }
      let type = `Status ${action}`;
      let nmessage = `Vendor ${vendor.owner_name || vendor.profile_name} Account Status ${action} by ${loginuser.profile_name}`;
      if(loginuser.role_id == 3){
        socketManager.updatevendorstatus(type, nmessage, { vendor_id: vendor_id, login_id:login_id });
        await Notification.create({
          user_id: login_id,
          user_type: 'admin',
          type: type,
          title: type,
          message:nmessage,
          metadata: { vendor_id: vendor_id, login_id:login_id }
        });
      }

    return res.json({ status: true, msg: `Status updated` });
  } catch (error) {
    return res.json({ status: false, msg: error.message });
  }
};

exports.approveVendor = async (req, res) => {
  try {
    const { vendor_id, approval, login_id} = req.body;
    if (!vendor_id) {
      return res
        .json({ status: false, msg: "vendor_id is required" });
    }

    const vendor = await User.findOne({ where: { id: vendor_id, role_id: 2 } });
    const loginuser = await User.findOne({ where: { id: login_id, role_id: {
            [Op.or]: [1, 3]
          } } });
    if (!vendor) {
      return res.json({ status: false, msg: "Vendor not found" });
    }

    // Update status to approved
    vendor.approval_status = approval;
    await vendor.save();
    let subject;
    let message;
    let action;

    // Send email with login credentials
    if(approval == 2){
         subject = "Vendor Profile Rejected";
         action = "Approved";
    }else{
         subject = "Vendor Approved - Login Details";
         action = "Rejected";

    }
    if(approval == 2){
        message = `
          <p>Hi ${vendor.owner_name || vendor.profile_name || "Vendor"},</p>
          <p>Your Vendor profile has been rejected by admin.</p>
          <p>Please contact to your service provider.</p>
          <p>Thank you,<br/>Team HomeTalent</p>
        `;
    }else{
       message = `
        <p>Hi ${vendor.owner_name || vendor.profile_name || "Vendor"},</p>
        <p>Your profile has been approved by admin. You can now log in using either your <strong>email</strong> or <strong>mobile number</strong>.</p>
        <p><strong>Login Email:</strong> ${vendor.email}</p>
        <p><strong>Login Mobile:</strong> ${vendor.phone}</p>
        <p><strong>Password:</strong> ${vendor.show_password}</p>
        <p>Click here to login: <a href="${req.headers.origin}/login">Login</a></p> 
        <p>Thank you,<br/>Team HomeTalent</p>
      `;
     
    }

    await commonEmail(vendor.email, subject, message);
      let type = `Registration Request ${action}`;
      let nmessage = `Vendor ${vendor.owner_name || vendor.profile_name} Registration Request ${action} by ${loginuser,profile_name}.`;
      if(loginuser.role_id == 3){
        socketManager.approvevendor(type, nmessage, { vendor_id: vendor_id, login_id:login_id });
        await Notification.create({
          user_id: login_id,
          user_type: 'admin',
          type: type,
          title: type,
          message:nmessage,
          metadata: { vendor_id: vendor_id, login_id:login_id }
        });
      }

    return res.json({
      status: true,
      msg: "Vendor approved and login details sent via email",
    });
  } catch (error) {
    return res.json({ status: false, msg: error.message });
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
      return res.status(400).json({ status: false, msg: "vendors array is required" });
    }

    // Validate all entries
    for (const v of vendors) {
      if (!v.vendor_id || !v.category_id || typeof v.sponsor_rank !== 'number') {
        return res.status(400).json({ status: false, msg: "Each item must include vendor_id, category_id, and sponsor_rank" });
      }
    }

    // Update vendor category ranks one by one
    for (const v of vendors) {
      // Use upsert to create or update the rank
      const rankData = await VendorCategoryRank.upsert({
        vendor_id: v.vendor_id,
        category_id: v.category_id,
        sponsor_rank: v.sponsor_rank,
        is_sponsored: v.sponsor_rank > 0 ? 1 : 0
      });

      // Send socket notification for each rank update
      // socketManager.sponsorRankUpdated({
      //   vendor_id: v.vendor_id,
      //   category_id: v.category_id,
      //   sponsor_rank: v.sponsor_rank,
      //   is_sponsored: v.sponsor_rank > 0 ? 1 : 0
      // });
    }

    res.json({ status: true, msg: "Category-specific sponsor ranks updated successfully" });

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
        msg: 'admin_id is required' 
      });
    }
  
    if (!['approve', 'reject'].includes(action)) {
      return res.json({ 
        status: false, 
        msg: 'Action must be either "approve" or "reject"' 
      });
    }
    
    const loginuser = await User.findOne({ where: { id: admin_id, role_id: {
            [Op.or]: [1, 3]
          } } });
  
    const request = await ProfileUpdateRequest.findOne({
      where: { id: request_id, status: 'pending' },
      include: [
        {
          model: User,
          as: 'vendor',
          attributes: ['id', 'email', 'owner_name', 'profile_name']
        }
      ]
    });

    if (!request) {
      return res.json({ 
        status: false, 
        msg: 'Profile update request not found or already processed' 
      });
    }

    // Update request status
    request.status = action === 'approve' ? 'approved' : 'rejected';
    request.admin_id = admin_id;
    request.admin_remarks = remarks || '';
    request.processed_at = new Date();
    await request.save();

    if (action === 'approve') {
      // Parse request_data if it's a string
      let updateData = request.request_data;
      if (typeof updateData === 'string') {
        try {
          updateData = JSON.parse(updateData);
        } catch (error) {
          return res.json({ 
            status: false, 
            msg: 'Invalid request data format' 
          });
        }
      }

      // Get user data before update
      const userBefore = await User.findByPk(request.vendor_id);

      // Apply the changes to vendor profile
      const updateResult = await User.update(
        updateData,
        { where: { id: request.vendor_id } }
      );

      // Get user data after update
      const userAfter = await User.findByPk(request.vendor_id);

      // Log the approval and approved data
      await Log.create({
        request_id,
        user_id: admin_id,
        user_type: 'admin',
        action: 'profile_update_approve',
        details: JSON.stringify({
          request_id,
          approved_data: updateData,
          vendor_id: request.vendor_id,
          user_before: userBefore,
          user_after: userAfter
        })
      });

      // Send email notification to vendor
      const subject = 'Profile Update Request Approved';

      const message = `
        <p>Hi ${request.vendor.owner_name || request.vendor.profile_name || 'Vendor'},</p>
        <p>Your profile update request has been approved by admin.</p>
        ${remarks ? `<p><strong>Admin Remarks:</strong> ${remarks}</p>` : ''}
        <p>Thank you,<br/>Team HomeTalent</p>
      `;

      await commonEmail(request.vendor.email, subject, message);

      // Send socket notification
      socketManager.profileUpdateProcessed({
        id: request.id,
        vendor_id: request.vendor_id,
        request_data: request.request_data,
        status: request.status,
        admin_remarks: request.admin_remarks,
        processed_at: request.processed_at
      }, request.vendor_id, action, loginuser.role_id, userAfter.owner_name || userAfter.profile_name, loginuser.profile_name);

      // Persist admin notification
      // try {
      //   await Notification.create({
      //     user_id: null,
      //     user_type: 'admin',
      //     type: 'profile_update_processed',
      //     title: 'Profile Update',
      //     message: `Vendor profile update request approved`,
      //     metadata: { request_id: request.id, vendor_id: request.vendor_id }
      //   });
      // } catch (e) { console.error('Failed to persist admin profile processed notification:', e.message); }

      // Persist vendor notification (approved)
      try {
        await Notification.create({
          user_id: request.vendor_id,
          user_type: 'vendor',
          type: 'profile_update_processed',
          title: 'Profile Update',
          message: 'Your profile update request has been Approved.',
          metadata: { request_id: request.id, action }
        });
      } catch (e) { console.error('Failed to persist vendor profile processed notification:', e.message); }

    } else {
      // Log the rejection and request data
      await Log.create({
        user_id: admin_id,
        user_type: 'admin',
        action: 'profile_update_reject',
        details: JSON.stringify({
          request_id,
          request_data: request.request_data,
          vendor_id: request.vendor_id,
          remarks
        })
      });

      // Send rejection email to vendor
      const subject = 'Profile Update Request Rejected';
      const message = `
        <p>Hi ${request.vendor.owner_name || request.vendor.profile_name || 'Vendor'},</p>
        <p>Your profile update request has been rejected by admin.</p>
        ${remarks ? `<p><strong>Reason:</strong> ${remarks}</p>` : ''}
        <p>Please review your request and submit again if needed.</p>
        <p>Thank you,<br/>Team HomeTalent</p>
      `;

      await commonEmail(request.vendor.email, subject, message);

      // Send socket notification
      socketManager.profileUpdateProcessed({
        id: request.id,
        vendor_id: request.vendor_id,
        request_data: request.request_data,
        status: request.status,
        admin_remarks: request.admin_remarks,
        processed_at: request.processed_at
      }, request.vendor_id, action);

      // Persist admin notification
      // try {
      //   await Notification.create({
      //     user_id: null,
      //     user_type: 'admin',
      //     type: 'profile_update_processed',
      //     title: 'Profile Update',
      //     message: `Vendor profile update request rejected`,
      //     metadata: { request_id: request.id, vendor_id: request.vendor_id }
      //   });
      // } catch (e) { console.error('Failed to persist admin profile processed notification:', e.message); }

      // Persist vendor notification (rejected)
      try {
        await Notification.create({
          user_id: request.vendor_id,
          user_type: 'vendor',
          type: 'profile_update_processed',
          title: 'Profile Update',
          message: 'Your profile update request has been Rejected.',
          metadata: { request_id: request.id, action }
        });
      } catch (e) { console.error('Failed to persist vendor profile processed notification:', e.message); }
    }

    res.json({ 
      status: true, 
      msg: `Profile update request ${action}d successfully`,
      data: {
        request_id: request.id,
        status: request.status,
        processed_at: request.processed_at
      }
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
    const { name, description, price, validity_in_months, days, features, status } = req.body;
    const pkg = await Package.create({ name, description, price, validity_in_months, days, features, status });
    
    // Send socket notification
    socketManager.packageCreated({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      validity_in_months: pkg.validity_in_months,
      features: pkg.features,
      status: pkg.status
    });

    await Notification.create({
      user_id: null,
      user_type: 'admin',
      type: 'package_created',
      title: 'New Package Created',
      message: `New package created.`,
      metadata: { package_id: pkg.id }
    });

    await Notification.create({
      user_id: null,
      user_type: 'vendor',
      type: 'package_created',
      title: 'New Package Available',
      message: `New package available`,
      metadata: { package_id: pkg.id }
    });  
    
    return res.json({ status: true, data: pkg });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
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

// Admin assigns a package to a vendor without payment
exports.assignPackageToVendor = async (req, res) => {
  try {
    const { vendor_id, package_id, login_id } = req.body;

    if (!vendor_id || !package_id) {
      return res.json({ status: false, msg: 'vendor_id and package_id are required' });
    }

    const vendor = await User.findOne({ where: { id: vendor_id, role_id: 2 } });
    const loginuser = await User.findOne({ where: { id: login_id, role_id: {
            [Op.or]: [1, 3]
          } } });
    if (!vendor) {
      return res.json({ status: false, msg: 'Vendor not found' });
    }

    if (!loginuser) {
      return res.json({ status: false, msg: 'Login User not found' });
    }

    const pkg = await Package.findOne({ where: { id: package_id, status: 1 } });
    if (!pkg) {
      return res.json({ status: false, msg: 'Package not found or inactive' });
    }

    // Check if vendor is fresh (no completed subscriptions ever)
    const completedCount = await VendorPackageSubscription.count({
      where: { vendor_id, payment_status: 'completed' }
    });
     
    
    const isFreshVendor = completedCount === 0;
    const isFreePackage = Number(pkg.price) === 0;
    console.log("!isFreshVendor && isFreePackage", !isFreshVendor && isFreePackage);
    
    if (!isFreshVendor && isFreePackage) {
      return res.json({
        status: false,
        msg: 'Plan already assigned to this vendor'
      });
    }

    const now = new Date();
    // Find latest running subscription
    const runningSub = await VendorPackageSubscription.findOne({
      where: {
          vendor_id,
          payment_status: "completed",
          [Op.and]: [
            where(fn("DATE", col("end_date")), {
              [Op.gte]: fn("CURDATE") // compares only date
            })
          ]
        },
      order: [['end_date', 'DESC']]
    });
  // console.log("runningSub", runningSub);
  
    let startDate, endDate;
    let validityDays;
    if (pkg.validity_in_months && pkg.validity_in_months != undefined) {
      validityDays = pkg.validity_in_months * 30;
    } else {
      validityDays = pkg.days || 30;
    }
    //  console.log("runningSub", runningSub);
    if (runningSub) {
      startDate = new Date(runningSub.end_date);
      startDate.setDate(startDate.getDate() + 1);
    } else {
      startDate = now;
    }
  
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + validityDays - 1);

    const subscription = await VendorPackageSubscription.create({
      vendor_id,
      package_id,
      amount: pkg.price.toString(),
      start_date: startDate,
      end_date: endDate,
      payment_status: 'completed',
      payment_reference: 'manual_admin',
      transaction_id: null,
      payment_method: 'manual'
    });

    // Optional: notify via socket/notification
    try {
      socketManager.vendorSubscribed({ id: subscription.id, vendor_id, package_id }, pkg.name, vendor.owner_name || vendor.profile_name, loginuser.role_id, loginuser.profile_name);
      
      await Notification.create({
        user_id: vendor_id,
        user_type: 'vendor',
        type: 'package_assigned',
        title: 'Package Assigned',
        message: `Admin assigned package ${pkg.name} to your account.`,
        metadata: { subscription_id: subscription.id, package_id }
      });
      
      if(loginuser.role_id == 2){
        await Notification.create({
          user_id: null,
          user_type: 'admin',
          type: 'package_assigned',
          title: 'Package Assigned',
          message: `New Subscription:${pkg.name} plan subscribed by Vendor(${vendor.owner_name || vendor.profile_name}).`,
          metadata: { subscription_id: subscription.id, package_id }
        });
      }else{
        await Notification.create({
          user_id: login_id,
          user_type: 'admin',
          type: 'package_assigned',
          title: 'Package Assigned',
          message: `New Subscription:${planName} assigned by (${loginuser.profile_name}) to Vendor(${vendorName}).`,
          metadata: { subscription_id: subscription.id, package_id }
        });
      }


    } catch (e) { /* ignore side-channel failures */ }

    return res.json({ status: true, msg: 'Package assigned successfully', data: subscription });
  }catch (error) {
    return res.json({ status: false, msg: error.message });
  }
};

exports.updatePackageStatus = async (req, res) => {
  try {
    const { package_id, status } = req.body;
    if (!package_id || typeof status === "undefined") {
      return res
        .json({ status: false, msg: "package_id and status are required" });
    }
    if (![0, 1].includes(Number(status))) {
      return res
        .json({
          status: false,
          msg: "status must be 0 (inactive) or 1 (active)",
        });
    }
    const pkg = await Package.findByPk(package_id);
    if (!pkg) {
      return res.json({ status: false, msg: "Package not found" });
    }
    pkg.status = status;
    await pkg.save();
    res.json({
      status: true,
      msg: `Package ${status == 1 ? "activated" : "inactivated"} successfully`,
    });
  } catch (error) {
    return res.json({ status: false, msg: error.message });
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
    const { id, extra_days, login_id} = req.body;

    if (!id || !extra_days) {
      return res
        .status(400)
        .json({
          status: false,
          msg: "subscription_id and extra_days are required",
        });
    }
    
    const sub = await VendorPackageSubscription.findByPk(id);
    const vendor = await User.findOne({ where: { id: sub.vendor_id, role_id: 2 } });
    const loginuser = await User.findOne({ where: { id: login_id, role_id: {
            [Op.or]: [1, 3]
          } } });
    if (!vendor) {
      return res.json({ status: false, msg: "Vendor not found" });
    }
    const pkg = await Package.findByPk(sub.package_id);

    if (!pkg) {
      return res.json({ status: false, msg: "Package not found" });
    }

    if (!sub) {
      return res.json({ status: false, msg: "Subscription not found" });
    }

    const endDate = new Date(sub.end_date);

    endDate.setDate(endDate.getDate() + Number(extra_days));

    sub.end_date = endDate;

    await sub.save();
    
    await Log.create({
        request_id: id,
        user_id: sub.vendor_id,
        package_id: sub.package_id,
        user_type: "admin",
        action: "extend_package_validity",
        details: extra_days
      });
       const new_end_date = new Date(sub.end_date);
       const dd = String(new_end_date.getDate()).padStart(2, "0");
       const mm = String(new_end_date.getMonth() + 1).padStart(2, "0");
       const yy = String(new_end_date.getFullYear());
       const formatted = `${dd}/${mm}/${yy}`;

      socketManager.vendorPackageExtended(sub.vendor_id, loginuser.role_id, vendor.owner_name || vendor.profile_name, loginuser,profile_name, {
        id: sub.id,
        vendor_id: sub.vendor_id,
        package_name: pkg.name,
        package_id: sub.package_id,
        new_end_date: formatted,
        extra_days: extra_days
      });

      await Notification.create({
        user_id: sub.vendor_id,
        user_type: 'vendor',
        type: 'package_extended',
        title: 'Package Extended',
        message: `Package ${pkg.name} has been extended by ${extra_days} days. New expiry date: ${formatted}.`,
        metadata: { subscription_id: sub.id, package_id: pkg.id, extra_days, new_end_date: formatted }
      });


    return res.json({
      status: true,
      msg: "Subscription end_date extended successfully",
      data: sub,
    });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
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
      where: { role_id: 2, approval_status: 0 },
    });

    const approveVendors = await User.count({
      where: { role_id: 2, approval_status: 1 },
    });

    const activeVendors = await User.count({
      where: { role_id: 2, status: 1 },
    });
   
    const inactiveVendors = await User.count({
      where: { role_id: 2, status: 2, approval_status: 1 },
    });
    // console.log("activeVendors",activeVendors);
    // console.log("inactiveVendors",inactiveVendors);

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
        approval_status: 0,
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
        approval_status: 0,
        createdAt: {
          [Op.gte]: startOfPrevMonth,
          [Op.lt]: startOfCurrentMonth,
        },
      },
    });
    
    const approveVendorsCurrentMonth = await User.count({
      where: {
        role_id: 2,
        approval_status: 1,
        createdAt: { [Op.gte]: startOfCurrentMonth },
      },
    });

    const approveVendorsPrevMonth = await User.count({
      where: {
        role_id: 2,
        approval_status: 1,
        createdAt: {
          [Op.gte]: startOfPrevMonth,
          [Op.lt]: startOfCurrentMonth,
        },
      },
    });

    const activeVendorsCurrentMonth = await User.count({
      where: {
        role_id: 2,
        status: 1,
        createdAt: { [Op.gte]: startOfCurrentMonth },
      },
    });

    const activeVendorsPrevMonth = await User.count({
      where: {
        role_id: 2,
        status: 1,
        createdAt: {
          [Op.gte]: startOfPrevMonth,
          [Op.lt]: startOfCurrentMonth,
        },
      },
    });

    const inactiveVendorsCurrentMonth = await User.count({
      where: {
        role_id: 2,
        status: 2,
        createdAt: { [Op.gte]: startOfCurrentMonth },
      },
    });

    const inactiveVendorsPrevMonth = await User.count({
      where: {
        role_id: 2,
        status: 2,
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

    const baseWhere = { role_id: 2, approval_status: 1 };

// 1️⃣ Vendors with NO subscription
const noSubscription = await User.count({
  where: baseWhere,
  include: [
    {
      model: VendorPackageSubscription,
      as : "vendor",
      required: false, // left join
    },
  ],
  group: ["User.id"],
  having: literal(`COUNT(vendor.id) = 0`),
});

const unsubscribedTotal = Array.isArray(noSubscription)
      ? noSubscription.length
      : noSubscription;


const withActive = await User.count({
  where: baseWhere,
  include: [
    {
      model: VendorPackageSubscription,
      as : "vendor",
      required: true,
      where: {
        start_date: { [Op.lte]: fn("NOW") },
        end_date: { [Op.gte]: fn("NOW") },
      },
    },
  ],
  distinct: true,
});



const onlyExpired = await User.findAll({
  where: {
    role_id: 2,
    approval_status: 1,
  },
  include: [
    {
      model: VendorPackageSubscription,
      as: "vendor",
      required: true,
    },
  ],
  group: [Sequelize.col("User.id")],
  having: literal(`MAX(\`vendor\`.\`end_date\`) < NOW()`),
});

const expiredTotal = onlyExpired.length;

    return res.json({
      status: true,
      data: {
        total_leads: totalLeads,
        total_vendors: totalVendors,
        pending_vendors: pendingVendors,
        approve_vendors: approveVendors,
        active_vendors: activeVendors,
        inactive_vendors: inactiveVendors,
        unsubscribed_vendors: unsubscribedTotal,
        subscribed_with_active: withActive,
        subscribed_only_expired: expiredTotal,
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
        approve_vendors_percentage_increase: getPercentageIncrease(
          approveVendorsCurrentMonth,
          approveVendorsPrevMonth
        ),
        active_vendors_percentage_increase: getPercentageIncrease(
          activeVendorsCurrentMonth,
          activeVendorsPrevMonth
        ),
        inactive_vendors_percentage_increase: getPercentageIncrease(
          inactiveVendorsCurrentMonth,
          inactiveVendorsPrevMonth
        ),
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

exports.getprofileRequestdata = async (req, res) => {
  try {
    const { request_id } = req.body;

    if (!request_id){
      return res.status(400).json({ status: false, msg: 'request_id is required' });
    }

    let lastLog = await Log.findOne({
      where: { request_id },
      order: [['id', 'DESC']], // Or use ['id', 'DESC'] if `created_at` doesn't exist
    });

    let details = lastLog?.details;

    if (typeof details === 'string') {
      try {
        details = JSON.parse(details);
      } catch (err) {
        console.error('Error parsing details JSON:', err);
      }
    }

    lastLog.details = details;

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

exports.packageextendhistory = async (req, res) => {
  try {
    const { vendor_id } = req.body;

    if (!vendor_id) {
      return res.status(400).json({ status: false, msg: "vendor_id is required" });
    }

    const history = await Log.findAll({
      where: {
        user_id: vendor_id,
        action: "extend_package_validity",
      },
      include: [
        { model: Package, as: "packagelog",
           attributes: ["id", "name"],
            include: [
            { model: VendorPackageSubscription, as: "Package", 
              attributes: ["id"],
              where: { vendor_id  }
             }

           ]
         
        }  
      ], 
      order: [["createdAt", "DESC"]],
    });

    if (history.length === 0) {
      return res.json({ status: true, data: [], msg: "No history found" });
    }

    return res.json({ status: true, data: history });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
}

exports.notifyExpiredPlans = async (req, res) => {
  try {
    const today = new Date();
    // Vendors with at least one active subscription (end_date >= today)
    const activeRows = await VendorPackageSubscription.findAll({
      where: {
        payment_status: 'completed',
        end_date: { [Op.gte]: today },
      },
      attributes: ['vendor_id'],
      group: ['vendor_id'],
      raw: true,
    });
    const activeVendorIds = new Set(activeRows.map(r => r.vendor_id));

    // Vendors whose last completed subscription has expired
    const lastRows = await VendorPackageSubscription.findAll({
      where: { payment_status: 'completed' },
      attributes: [
        'vendor_id',
        [Sequelize.fn('MAX', Sequelize.col('end_date')), 'last_end_date']
      ],
      group: ['vendor_id'],
      having: Sequelize.where(Sequelize.fn('MAX', Sequelize.col('end_date')), { [Op.lt]: today }),
      raw: true,
    });

    let notifyCount = 0;

    for (const row of lastRows) {
      const vendorId = row.vendor_id;
      // If vendor has any active plan, skip
      if (activeVendorIds.has(vendorId)) continue;

      // Fetch the last (most recent) completed subscription
      const lastSub = await VendorPackageSubscription.findOne({
        where: { vendor_id: vendorId, payment_status: 'completed' },
        order: [['end_date', 'DESC']],
        include: [
          { model: User, as: 'vendor', attributes: ['id','owner_name','profile_name'] },
          { model: Package, as: 'Package', attributes: ['id','name'] }
        ]
      });
      if (!lastSub) continue;

      // Optional deduplication: if we've already notified after this expiry, skip
      const existingVendorNotif = await Notification.findOne({
        where: { user_type: 'vendor', user_id: vendorId, type: 'plan_expired' },
        order: [['createdAt', 'DESC']]
      });
      if (existingVendorNotif && existingVendorNotif.createdAt >= lastSub.end_date) continue;

      const vendorName = lastSub.vendor?.owner_name || lastSub.vendor?.profile_name || '';

      // Emit sockets
      socketManager.planExpired(vendorId, vendorName, { id: lastSub.id, end_date: lastSub.end_date, package_id: lastSub.package_id });

      // Persist vendor notification
      try {
        await Notification.create({
          user_id: vendorId,
          user_type: 'vendor',
          type: 'plan_expired',
          title: 'Plan Expired',
          message: 'Plan expired. Please renew to avoid interruption.',
          metadata: { subscription_id: lastSub.id, end_date: lastSub.end_date }
        });
      } catch (e) { console.error('Failed to persist vendor plan expired notification:', e.message); }

      // Persist admin notification
      try {
        await Notification.create({
          user_id: null,
          user_type: 'admin',
          type: 'plan_expired',
          title: 'Plan Expired',
          message: `Vendor ${vendorName} subscription plan has expired.`,
          metadata: { vendor_id: vendorId, subscription_id: lastSub.id }
        });
      } catch (e) { console.error('Failed to persist admin plan expired notification:', e.message); }

      notifyCount++;
    }

    res.json({ status: true, msg: 'Expiry notifications processed', count: notifyCount });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.insertcategoryimages = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const categories = await Category.findAll();
    for (const category of categories){
      const imageFolder = path.join(__dirname, "../../media/category");

      // Try to find a file with the same name as category (any extension)
      const files = fs.readdirSync(imageFolder);
      const file = files.find(f => path.parse(f).name === category.name);

      if (file) {
        const filePath = path.join(imageFolder, file);

        const mimeType = mime.lookup(filePath);

        const imageUrl = `media/category/${file}`;
        
        await category.update({ image_url: imageUrl });
      } else {
        console.log(`⚠️ No image found for category: ${category.name}`);
      }
    }

    return res.json({ status: true, msg: "done" });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  } 
}

exports.getAllFeedBack = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { count, rows } = await FeedBack.findAndCountAll({
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

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000); // ensures 4 digits
}

exports.sendotp = async (req, res) => {
  try {
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

exports.getVendorsByPackageStatus = async (req, res) => {
  try {
    const { status } = req.query;

    if (!["active", "expired", "unsubscribed"].includes(status)) {
      return res.status(400).json({ status: false, msg: "Invalid status parameter" });
    }

    const baseWhere = { role_id: 2, approval_status: 1 };
    let vendors;

    if(status === "unsubscribed") {
      // Vendors with NO subscriptions
      vendors = await User.findAll({
        where: baseWhere,
        include: [
          {
            model: VendorPackageSubscription,
            as: "vendor", // use your alias here if defined
            required: false,
          },
          {
          model: Category,
          attributes: ['id', 'name'], // bring category name
          required: false
        },
        { model: City, attributes: ['id', 'name'], required: false },
        { model: State, attributes: ['id', 'name'], required: false }
        ],
        group: ["User.id"],
        having: literal(`COUNT(vendor.id) = 0`), // match alias
      });
    } else if (status === "active") {
      // Vendors with at least one active subscription
      vendors = await User.findAll({
  where: baseWhere,
  include: [
    {
      model: VendorPackageSubscription,
      as: "vendor",
      required: true,
    },
    {
      model: Category,
      attributes: ["id", "name"],
      required: false,
    },
    { model: City, attributes: ["id", "name"], required: false },
    { model: State, attributes: ["id", "name"], required: false },
  ],
  group: ["User.id"],
  having: literal(`MAX(\`vendor\`.\`end_date\`) >= NOW()`), // latest package must still be active
});

    } else if (status === "expired") {
     vendors = await User.findAll({
  where: {
    role_id: 2,
    approval_status: 1,
  },
  include: [
    {
      model: VendorPackageSubscription,
      as: "vendor",
      required: true,
    },
    { model: Category, attributes: ["id", "name"], required: false },
    { model: City, attributes: ["id", "name"], required: false },
    { model: State, attributes: ["id", "name"], required: false },
  ],
  group: ["User.id"],
  having: literal(`MAX(\`vendor\`.\`end_date\`) < NOW()`),
});

    }
console.log("vendors", vendors);

    return res.json({
      status: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, msg: "Server error", error: error.message });
  }
};







