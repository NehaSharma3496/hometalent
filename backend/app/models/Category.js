const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Category = sequelize.define('Category', {
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
    parent_category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    display_order: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    service_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'service_types',
            key: 'id'
        }
    },
}, {
    tableName: 'categories',
    timestamps: true
});

Category.associate = (models) => {
    Category.hasMany(models.Category, { foreignKey: 'parent_category_id', as: 'subcategories' });
    Category.belongsTo(models.Category, { foreignKey: 'parent_category_id', as: 'parent_category' });
    Category.hasMany(models.Product, { foreignKey: 'category_id' });
    Category.belongsTo(models.ServiceType, { foreignKey: 'service_type' });
    Category.belongsTo(Category, {
        as: 'parentCategory',
        foreignKey: 'parent_category_id'
    });
    Category.belongsTo(models.User, { foreignKey: 'user_id' });
};

module.exports = Category; 