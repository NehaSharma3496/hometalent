const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const VendorCategoryRank = sequelize.define('VendorCategoryRank', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sponsor_rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    is_sponsored: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 1 = sponsored, 0 = not sponsored
    },
}, {
    tableName: 'vendor_category_ranks',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['vendor_id', 'category_id']
        }
    ]
});

VendorCategoryRank.associate = (models) => {
    VendorCategoryRank.belongsTo(models.User, { foreignKey: 'vendor_id', as: 'vendor' });
    VendorCategoryRank.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
};

module.exports = VendorCategoryRank; 