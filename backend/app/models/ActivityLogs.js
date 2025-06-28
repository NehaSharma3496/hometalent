const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ActivityLogs = sequelize.define('ActivityLogs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', 
            key: 'id', 
        },
    },
    action: {
        type: DataTypes.STRING,
        allowNull: true
    },
    request: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    response: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
},
{
    tableName: 'activity_logs',
    timestamps: true,
});


// Associate method define karna
ActivityLogs.associate = (models) => {
    ActivityLogs.belongsTo(models.User, {foreignKey: 'user_id'});
};

module.exports = ActivityLogs;
