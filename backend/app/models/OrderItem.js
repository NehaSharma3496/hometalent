const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    variant_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'product_variants',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    special_instructions: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'order_items',
    timestamps: true
});

OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'product_id' });
    OrderItem.belongsTo(models.ProductVariant, { foreignKey: 'variant_id' });
};

module.exports = OrderItem; 