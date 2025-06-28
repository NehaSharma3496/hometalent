const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: { // Foreign key
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    address_line1: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    address_line2: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    postal_code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'India'
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    contact_phone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    operating_hours: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_dark_store: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'stores',
    timestamps: true
});

Store.associate = (models) => {
    Store.hasMany(models.Inventory, { foreignKey: 'store_id' });
    Store.hasMany(models.Order, { foreignKey: 'assigned_vendor_id', as: 'orders' });
    Store.belongsTo(models.User, { foreignKey: 'user_id' });

};

module.exports = Store; 