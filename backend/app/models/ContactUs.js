const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ContactUs = sequelize.define('ContactUs', {
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
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'contact_us',
    timestamps: true,
});

module.exports = ContactUs; 