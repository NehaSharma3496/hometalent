const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ProductVariant = sequelize.define('ProductVariant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    value: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'product_variants',
    timestamps: true
});

ProductVariant.associate = (models) => {
    ProductVariant.belongsTo(models.Product, { foreignKey: 'product_id' });
    ProductVariant.hasMany(models.Inventory, { foreignKey: 'variant_id' });
};

module.exports = ProductVariant; 