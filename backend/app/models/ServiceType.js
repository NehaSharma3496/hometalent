// models/ServiceType.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ServiceType = sequelize.define('ServiceType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'service_types',
  timestamps: false
});

ServiceType.associate = (models) => {
  ServiceType.hasMany(models.Category, { foreignKey: 'service_type' });
}


module.exports = ServiceType;
