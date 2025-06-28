const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'stores',
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
        allowNull: false
    },
    low_stock_threshold: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    last_restocked_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'inventory',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['store_id', 'product_id', 'variant_id']
        }
    ]
});

Inventory.associate = (models) => {
    Inventory.belongsTo(models.Store, { foreignKey: 'store_id' });
    Inventory.belongsTo(models.Product, { foreignKey: 'product_id' });
    Inventory.belongsTo(models.ProductVariant, { foreignKey: 'variant_id' });
};

module.exports = Inventory; 