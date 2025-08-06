const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Log = sequelize.define('Log', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    request_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    package_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    user_type: {
        type: DataTypes.STRING,
        allowNull: false, // 'vendor' or 'client'
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'logs',
    timestamps: true,
});

Log.associate = (models) => {
    Log.belongsTo(models.Package, { foreignKey: 'package_id', as: 'packagelog' });
    Log.belongsTo(models.User, { foreignKey: 'user_id', as: 'userlog' });
};

module.exports = Log; 