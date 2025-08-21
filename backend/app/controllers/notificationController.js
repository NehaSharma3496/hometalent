const { Notification } = require('../models');

exports.listAdminNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const offset = (page - 1) * limit;

    const { rows, count } = await Notification.findAndCountAll({
      where: { user_type: 'admin' },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({ status: true, data: rows, meta: { page, limit, total: count } });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.listVendorNotifications = async (req, res) => {
  try {
    const vendor_id = parseInt(req.params.vendor_id, 10) || parseInt(req.query.vendor_id, 10);
    if (!vendor_id) {
      return res.status(400).json({ status: false, msg: 'vendor_id is required' });
    }

    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const offset = (page - 1) * limit;

    const { rows, count } = await Notification.findAndCountAll({
      where: { user_type: 'vendor', user_id: vendor_id },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({ status: true, data: rows, meta: { page, limit, total: count } });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByPk(id);
    if (!notif) {
      return res.status(404).json({ status: false, msg: 'Notification not found' });
    }
    notif.is_read = true;
    await notif.save();
    res.json({ status: true, data: notif });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
}; 