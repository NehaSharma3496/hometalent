const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const VendorPackageSubscription = sequelize.define('VendorPackageSubscription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    package_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    amount: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // pending, completed, failed
    },
    payment_reference: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'vendor_package_subscriptions',
    timestamps: true,
});

VendorPackageSubscription.associate = (models) => {
    VendorPackageSubscription.belongsTo(models.User, { foreignKey: 'vendor_id', as: 'vendor' });
    VendorPackageSubscription.belongsTo(models.Package, { foreignKey: 'package_id', as: 'Package' });
};

module.exports = VendorPackageSubscription; 