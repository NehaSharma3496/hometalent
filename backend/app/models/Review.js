const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
  const Review = sequelize.define('Review', {
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, 
        validate: {
            isIn: [[0, 1]], // Validates that the value is either 0 or 1
        },
        comment: '1 = active, 0 = inactive',
    },
    approve_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2, 
        validate: {
            isIn: [[0, 1, 2]], // Validates that the value is either 0 or 1
        },
        comment: '1 = approve, 0 = reject',
    },
  },
    {
        tableName: 'reviews',
        timestamps: true,
    }
);

Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'vendor_id'});
}

module.exports = Review;

