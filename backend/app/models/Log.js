const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Log = sequelize.define('Log', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

module.exports = Log; 