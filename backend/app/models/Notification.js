const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Vendor or Admin user id; null for broadcast admin notifications',
  },
  user_type: {
    type: DataTypes.ENUM('admin', 'vendor'),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'notification key e.g., vendor_registration_request, profile_update_request, gallery_request, plan_subscribed, plan_expired, contact_us, lead, review_submitted, gallery_processed, profile_update_processed'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    { fields: ['user_type', 'user_id'] },
    { fields: ['type'] },
    { fields: ['is_read'] }
  ]
});

module.exports = Notification; 