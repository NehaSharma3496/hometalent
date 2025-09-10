const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
  const Report = sequelize.define('Report', {
    vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true, 
        validate: {
            isEmail: true, 
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true, 
    }, 
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
  },
    {
        tableName: 'reports',
        timestamps: true,
    }
);

Report.associate = (models) => {
    Report.belongsTo(models.User, { foreignKey: 'vendor_id' });

}

module.exports = Report;

