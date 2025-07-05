const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const States = sequelize.define('States', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
{
    tableName: 'states',
    timestamps: true,
});


// Associate method define karna
States.associate = (models) => {
    States.hasMany(models.User, { foreignKey: 'state_id' });
    States.hasMany(models.City, { foreignKey: 'state_id' });   
};

module.exports = States;
