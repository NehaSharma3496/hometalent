const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Post = sequelize.define('Post', {
    id: { // Primary key
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_id: { // Foreign key
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Refers to the User table
            key: 'id',      // Refers to the User's primary key
        },
    },
});

// Associate method define karna
Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'user_id' }); // Ek post ek user se related
};

module.exports = Post;
