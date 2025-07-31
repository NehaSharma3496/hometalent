const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
  const Blog = sequelize.define('Blog', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false, // stores full image URL
    },
    short_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    long_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
    {
        tableName: 'blogs',
        timestamps: true,
    }
);

Blog.associate = (models) => {
    // Define associations here if needed
    // For example, if you have a User model and want to associate it with Blog:
    // Blog.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
}

module.exports = Blog;

