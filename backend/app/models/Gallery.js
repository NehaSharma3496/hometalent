const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Gallery = sequelize.define('Gallery', {
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
    file_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file_type: {
        type: DataTypes.ENUM('image', 'video'),
        allowNull: false,
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'File size in bytes',
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
    sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Order for displaying gallery items',
    },
      added_in_admin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'If copied to admin gallery, store that gallery ID here',
    },
},
{
    tableName: 'gallery',
    timestamps: true,
});

Gallery.associate = (models) => {
    Gallery.belongsTo(models.User, { 
        foreignKey: 'user_id', 
        as: 'user' 
    });
    Gallery.belongsTo(models.User, { 
        foreignKey: 'admin_id', 
        as: 'admin' 
    });
};

module.exports = Gallery; 