const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: true
    },

    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
},
{
    tableName: 'permissions',
    timestamps: true,
});


// Associate method define karna
Permission.associate = (models) => {
    Permission.hasMany(models.UserPermission, { foreignKey: 'permission_id', as: 'user_permissions' });
    
};

module.exports = Permission;
