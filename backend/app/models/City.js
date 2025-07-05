const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'States', 
            key: 'id', 
        },
    }
},
{
    tableName: 'cities',
    timestamps: true,
});


// Associate method define karna
City.associate = (models) => {
     City.belongsTo(models.State, {foreignKey: 'state_id'});
     City.hasMany(models.User, { foreignKey: 'city_id' });
};

module.exports = City;
