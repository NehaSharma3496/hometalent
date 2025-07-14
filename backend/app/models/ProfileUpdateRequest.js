const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ProfileUpdateRequest = sequelize.define('ProfileUpdateRequest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    request_data: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'JSON object containing the requested changes',
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
    },
    admin_remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Admin comments on approval/rejection',
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        comment: 'Admin who processed the request',
    },
    processed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When the request was processed by admin',
    },
},
{
    tableName: 'profile_update_requests',
    timestamps: true,
});

ProfileUpdateRequest.associate = (models) => {
    ProfileUpdateRequest.belongsTo(models.User, { 
        foreignKey: 'vendor_id', 
        as: 'vendor' 
    });
    ProfileUpdateRequest.belongsTo(models.User, { 
        foreignKey: 'admin_id', 
        as: 'admin' 
    });
};

module.exports = ProfileUpdateRequest; 