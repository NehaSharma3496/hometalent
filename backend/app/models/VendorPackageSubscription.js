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
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Package subscription amount in INR',
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
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Payment status of the subscription',
    },
    payment_reference: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Cashfree order ID or payment reference',
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Cashfree transaction ID after successful payment',
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Payment method used (UPI, Card, Net Banking, etc.)',
    },
    refund_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Amount refunded if applicable',
    },
    refund_reference: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Cashfree refund ID',
    },
    refund_note: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for refund',
    },
}, {
    tableName: 'vendor_package_subscriptions',
    timestamps: true,
    indexes: [
        {
            fields: ['vendor_id', 'payment_status']
        },
        {
            fields: ['payment_reference']
        },
        {
            fields: ['end_date']
        }
    ]
});

VendorPackageSubscription.associate = (models) => {
    VendorPackageSubscription.belongsTo(models.User, { foreignKey: 'vendor_id', as: 'vendor' });
    VendorPackageSubscription.belongsTo(models.Package, { foreignKey: 'package_id', as: 'Package' });
};

module.exports = VendorPackageSubscription; 