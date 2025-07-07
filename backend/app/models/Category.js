const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'categories',
    timestamps: true
});

Category.associate = (models) => {
    // Category.hasMany(models.Category, { foreignKey: 'parent_category_id', as: 'subcategories' });
    // Category.belongsTo(models.Category, { foreignKey: 'parent_category_id', as: 'parent_category' });
    //Category.hasMany(models.User, { foreignKey: 'category_id' });
    // Category.belongsTo(models.ServiceType, { foreignKey: 'service_type' });
    // Category.belongsTo(Category, {
    //     as: 'parentCategory',
    //     foreignKey: 'parent_category_id'
    // });
    // Category.belongsTo(models.User, { foreignKey: 'user_id' });
};

module.exports = Category; 