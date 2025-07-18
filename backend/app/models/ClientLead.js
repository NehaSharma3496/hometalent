const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ClientLead = sequelize.define('ClientLead', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    query: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'client_leads',
    timestamps: true,
});

ClientLead.associate = (models) => {
    ClientLead.belongsTo(models.User, { foreignKey: 'vendor_id', as: 'vendor' });
};

module.exports = ClientLead; 