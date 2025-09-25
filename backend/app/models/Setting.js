const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Setting = sequelize.define('Setting', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    socket_url: { 
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'settings',
    timestamps: true
});

Setting.associate = (models) => {
  
};

module.exports = Setting; 