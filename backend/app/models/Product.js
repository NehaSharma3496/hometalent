const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Product = sequelize.define('Product', {
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
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    mrp: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    selling_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    tax_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    weight: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: true
    },
    weight_unit: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    inventory_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['stocked', 'made_to_order']]
        }
    },
    is_vegetarian: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    is_vegan: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    is_returnable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    return_period: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    country_of_origin: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    shelf_life: {
        type: DataTypes.STRING(100),
        allowNull: true
    },

    // Image Section
    image_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    display_order: {
        type: DataTypes.INTEGER,
        allowNull: true
    },


    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'products',
    timestamps: true
});

Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    Product.hasMany(models.ProductVariant, { foreignKey: 'product_id' });
    Product.hasMany(models.Inventory, { foreignKey: 'product_id' });
    Product.belongsTo(models.User, { foreignKey: 'user_id' });
};

module.exports = Product; 