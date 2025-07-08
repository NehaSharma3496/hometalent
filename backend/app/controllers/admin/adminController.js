const { User, Category } = require('../../models'); // adjust path as needed
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

