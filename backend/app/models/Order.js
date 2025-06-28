const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    assigned_vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'stores',
            key: 'id'
        }
    },
    delivery_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    delivery_latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    delivery_longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'PENDING',
        validate: {
            isIn: [['PENDING', 'ASSIGNED', 'ACCEPTED', 'REJECTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']]
        }
    },
    payment_method: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['CASH', 'CARD', 'UPI', 'WALLET']]
        }
    },
    payment_status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'PENDING',
        validate: {
            isIn: [['PENDING', 'PAID', 'FAILED', 'REFUNDED']]
        }
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    assigned_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    accepted_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    prepared_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    out_for_delivery_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    delivered_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cancellation_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    special_instructions: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'orders',
    timestamps: true
});

Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'user_id' });
    Order.belongsTo(models.Store, { 
        foreignKey: 'assigned_vendor_id',
        as: 'vendor'
    });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
};

module.exports = Order; 