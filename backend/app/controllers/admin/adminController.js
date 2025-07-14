const { User, Category, ProfileUpdateRequest } = require('../../models'); // adjust path as needed
const { commonEmail } = require("../../helper/commonEmail");

exports.listAllVendors = async (req, res) => {
  try {
    const vendors = await User.findAll({
      where: { role_id: 2 },
      order: [['createdAt', 'DESC']],
      raw: true
    });

    // Get all unique category IDs
    const categoryIds = [
      ...new Set(
        vendors.flatMap(v =>
          v.category_id ? v.category_id.split(',').map(id => parseInt(id.trim())) : []
        )
      )
    ];

    // Fetch category names
    const categories = await Category.findAll({
      where: { id: categoryIds },
      raw: true
    });


    const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

    // Attach category names to each vendor
    const enrichedVendors = vendors.map(v => ({
      ...v,
      category_names: (v.category_id || '')
        .split(',')
        .map(id => categoryMap[parseInt(id.trim())])
        .filter(Boolean)
    }));

    res.json({ status: true, data: enrichedVendors });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.listPendingVendors = async (req, res) => {
  try {
    const vendors = await User.findAll({
      where: { role_id: 2, status: 0 },
      order: [['createdAt', 'DESC']]
    });
    res.json({ status: true, data: vendors });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.listSponsoredVendors = async (req, res) => {
  try {
    const vendors = await User.findAll({
      where: {
        role_id: 2,
        status: 1,
        is_sponsored: 1
      },
      order: [['sponsor_rank', 'ASC']] // top sponsor = 1
    });
    res.json({ status: true, data: vendors });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.listBlockedVendors = async (req, res) => {
  try {
    const vendors = await User.findAll({
      where: { role_id: 2, status: 2 },
      order: [['updatedAt', 'DESC']]
    });
    res.json({ status: true, data: vendors });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.updateVendorStatus = async (req, res) => {
  try {
    const { vendor_id, status } = req.body; // status = 1 (approve), 2 (block), 0 (unapprove)

    if (![0, 1, 2].includes(Number(status))){
      return res.status(400).json({ status: false, msg: 'Invalid status value' });
    }

    const vendor = await User.findOne({ where: { id: vendor_id, role_id: 2 } });
    if (!vendor) {
      return res.json({ status: false, msg: 'Vendor not found' });
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
    const { vendor_id } = req.body;
    if (!vendor_id) {
      return res.status(400).json({ status: false, msg: 'vendor_id is required' });
    }

    const vendor = await User.findOne({ where: { id: vendor_id, role_id: 2 } });
    if (!vendor) {
      return res.json({ status: false, msg: 'Vendor not found' });
    }

    // Update status to approved
    vendor.status = 1;
    await vendor.save();

    // Send email with login credentials
    const subject = 'Vendor Approved - Login Details';
    const message = `
      <p>Hi ${vendor.owner_name || vendor.profile_name || 'Vendor'},</p>
      <p>Your profile has been approved by admin. You can now log in using either your <strong>email</strong> or <strong>mobile number</strong>.</p>
      <p><strong>Login Email:</strong> ${vendor.email}</p>
      <p><strong>Login Mobile:</strong> ${vendor.phone}</p>
      <p><strong>Password:</strong> ${vendor.show_password}</p>
      <p>Click here to login: <a href="http://localhost:3000/login">Login</a></p> 
      <p>Thank you,<br/>Team HomeTalent</p>
    `;

    await commonEmail(vendor.email, subject, message);

    res.json({ status: true, msg: 'Vendor approved and login details sent via email' });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.active_vendors = async (req, res) => {
  try {
    const vendors = await User.findAll({
      where: {
        role_id: 2,
        status: 1
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({ status: true, data: vendors });
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
      if (!v.vendor_id || typeof v.sponsor_rank !== 'number') {
        return res.status(400).json({ status: false, msg: "Each item must include vendor_id and sponsor_rank" });
      }
    }

    // Update vendors one by one
    for (const v of vendors) {
      await User.update(
        { sponsor_rank: v.sponsor_rank, is_sponsored: 1 },
        { where: { id: v.vendor_id, role_id: 2 } }
      );
    }

    res.json({ status: true, msg: "Sponsor ranks updated successfully" });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Get all pending profile update requests
exports.getPendingProfileUpdateRequests = async (req, res) => {
  try {
    const requests = await ProfileUpdateRequest.findAll({
      where: { status: 'pending' },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: User,
          as: 'vendor',
          attributes: ['id', 'owner_name', 'profile_name', 'email', 'phone', 'status']
        }
      ]
    });

    res.json({ 
      status: true, 
      data: requests 
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
          as: 'vendor',
          attributes: ['id', 'owner_name', 'profile_name', 'email', 'phone', 'status', 'state_id', 'city_id', 'pin_code', 'price_range', 'short_description', 'category_id', 'experience_since', 'long_description', 'facebook_link', 'instagram_link', 'twitter_link', 'linkedin_link', 'youtube_link', 'website_link', 'image']
        },
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'owner_name', 'profile_name']
        }
      ]
    });

    if (!request) {
      return res.json({ 
        status: false, 
        msg: 'Profile update request not found' 
      });
    }

    // Debug: Log the request data
    console.log('Request ID:', request_id);
    console.log('Request Data Type:', typeof request.request_data);
    console.log('Request Data:', request.request_data);
    console.log('Vendor ID:', request.vendor_id);

    res.json({ 
      status: true, 
      data: request 
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
          // console.error('Error parsing request_data:', error);
          return res.json({ 
            status: false, 
            msg: 'Invalid request data format' 
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
      const updateResult = await User.update(
        updateData,
        { where: { id: request.vendor_id } }
      );

      // console.log('Update result:', updateResult);

      // Get user data after update
      const userAfter = await User.findByPk(request.vendor_id);
      // console.log('User data after update:', userAfter ? userAfter.toJSON() : 'User not found');

      // Send email notification to vendor
      const subject = 'Profile Update Approved';
      const message = `
        <p>Hi ${request.vendor.owner_name || request.vendor.profile_name || 'Vendor'},</p>
        <p>Your profile update request has been approved by admin.</p>
        <p><strong>Updated Fields:</strong></p>
        <ul>
          ${Object.keys(updateData).map(key => {
            if (key === 'image' || key === 'video') {
              return `<li>${key}: File uploaded successfully</li>`;
            }
            return `<li>${key}: ${updateData[key]}</li>`;
          }).join('')}
        </ul>
        ${remarks ? `<p><strong>Admin Remarks:</strong> ${remarks}</p>` : ''}
        <p>Thank you,<br/>Team HomeTalent</p>
      `;

      await commonEmail(request.vendor.email, subject, message);
    } else {
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
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      whereClause.status = status;
    }

    const requests = await ProfileUpdateRequest.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'vendor',
          attributes: ['id', 'owner_name', 'profile_name', 'email', 'phone']
        },
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'owner_name', 'profile_name']
        }
      ]
    });

    res.json({ 
      status: true, 
      data: {
        requests: requests.rows,
        total: requests.count,
        current_page: parseInt(page),
        total_pages: Math.ceil(requests.count / limit)
      }
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

