// models/Role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
     role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'e.g., Admin,Vendor.',
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'e.g., Admin, Vendor.',
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1: Active, 0: Inactive
        comment: '1: Active, 0: Inactive',
    },
    is_disable: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    
},
{
    tableName: 'roles', 
    timestamps: true, 
});


Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'role_id' });
};

module.exports = Role;
