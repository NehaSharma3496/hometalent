const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const FeedBack = sequelize.define('FeedBack', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'feedback',
    timestamps: true,
});

module.exports=FeedBack;