const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
  const Review = sequelize.define('Review', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    // Define associations here if needed
    // For example, if you have a User model and want to associate it with Blog:
    // Blog.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
}

module.exports = Review;

