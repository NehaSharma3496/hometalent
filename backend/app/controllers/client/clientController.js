const { ContactUs, ClientLead, User, Notification, FeedBack } = require('../../models');
const { commonEmail } = require('../../helper/commonEmail');
const socketManager = require('../../socket/socketManager');

exports.submitContactUs = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ status: false, msg: 'name, email, subject, and message are required' });
    }
    const contact = await ContactUs.create({ name, email, phone, subject, message });
    
    // Send socket notification
    socketManager.contactUsSubmitted({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      subject: contact.subject,
      message: contact.message
    });

    // Persist admin notification
    try {
      await Notification.create({
        user_id: null,
        user_type: 'admin',
        type: 'contact_us',
        title: 'Contact Us',
        message: 'New Enquiry request has been received',
        metadata: { id: contact.id }
      });
    } catch (e) { console.error('Failed to persist admin contact notification:', e.message); }
    
    res.json({ status: true, msg: 'Contact request submitted successfully', data: contact });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.submitLead = async (req, res) => {
  try {
    const { vendor_id, name, phone, email, query } = req.body;
    if (!vendor_id || !name || !phone) {
      return res.status(400).json({ status: false, msg: 'vendor_id, name, phone are required' });
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

    // Send socket notification
    socketManager.leadSubmitted({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      query: lead.query,
      vendor_id: lead.vendor_id
    }, vendor_id);

    // Persist vendor and admin notifications
    try {
      await Notification.create({
        user_id: vendor_id,
        user_type: 'vendor',
        type: 'lead_vendor',
        title: 'New Lead',
        message: 'New Enquiry has been received.',
        metadata: { id: lead.id }
      });
      await Notification.create({
        user_id: null,
        user_type: 'admin',
        type: 'lead_admin',
        title: 'New Lead',
        message: 'New Product enquiry has been received.',
        metadata: { id: lead.id, vendor_id }
      });
    } catch (e) { console.error('Failed to persist lead notifications:', e.message); }

    res.json({ status: true, msg: 'Lead submitted and vendor details sent to your email.' });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
} 


exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ status: false, msg: 'name, email, and message are required' });
    }
    const feedback = await FeedBack.create({ name, email, phone, message });

    // Send socket notification
    socketManager.feedbackSubmitted({
      id: feedback.id,
      name: feedback.name,
      email: feedback.email,
      phone: feedback.phone,
      message: feedback.message
    });

    // Persist admin notification
    try {
      await Notification.create({
        user_id: null,
        user_type: 'admin',
        type: 'feedback',
        title: 'Feedback',
        message: 'New Feedback has been received',
        metadata: { id: feedback.id }
      });
    } catch (e) { console.error('Failed to persist admin feedback notification:', e.message); }

    res.json({ status: true, msg: 'Feedback request submitted successfully', data: feedback });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};