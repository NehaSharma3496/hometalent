const { ContactUs, ClientLead, User } = require('../../models');
const { commonEmail } = require('../../helper/commonEmail');

exports.submitContactUs = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ status: false, msg: 'name, email, subject, and message are required' });
    }
    const contact = await ContactUs.create({ name, email, phone, subject, message });
    res.json({ status: true, msg: 'Contact request submitted successfully', data: contact });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.submitLead = async (req, res) => {
  try {
    const { vendor_id, name, phone, email, query } = req.body;
    if (!vendor_id || !name || !phone || !email) {
      return res.status(400).json({ status: false, msg: 'vendor_id, name, phone, and email are required' });
    }
    // Store the lead
    const lead = await ClientLead.create({ vendor_id, name, phone, email, query });
    // Get vendor details
    const vendor = await User.findByPk(vendor_id, { attributes: ['owner_name', 'profile_name', 'email', 'phone'] });
    if (vendor) {
      // Email vendor details to client
      const subject = 'Vendor Details for Your Query';
      const text = `Thank you for your query. Here are the vendor details you selected:\n\nName: ${vendor.owner_name} (${vendor.profile_name})\nEmail: ${vendor.email}\nContact: ${vendor.phone}`;
      await commonEmail(email, subject, text);
    }
    res.json({ status: true, msg: 'Lead submitted and vendor details sent to your email.' });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
}; 