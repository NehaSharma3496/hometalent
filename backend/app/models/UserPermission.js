const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const UserPermission = sequelize.define('UserPermission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },

    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'permissions',
            key: 'id',
        },
    }
},
{
    tableName: 'user_permissions',
    timestamps: true,
});


// Associate method define karna
UserPermission.associate = (models) => {
    UserPermission.belongsTo(models.User, { foreignKey: 'user_id' });
    UserPermission.belongsTo(models.Permission, { foreignKey: 'permission_id' });
    
};

module.exports = UserPermission; 
