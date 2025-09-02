const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Package = sequelize.define('Package', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    validity_in_months: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    days: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    features: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1 = active, 0 = inactive
    },
}, {
    tableName: 'packages',
    timestamps: true,
});

module.exports = Package; 

Package.associate = (models) => {
    Package.hasMany(models.VendorPackageSubscription, { foreignKey: 'package_id', as: 'Package' });
    Package.hasMany(models.Log, { foreignKey: 'package_id', as: 'packagelog' });
    
    // Additional associations can be added here
}