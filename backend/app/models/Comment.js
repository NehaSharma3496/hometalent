const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Refers to the User table
            key: 'id',      // Refers to User's primary key
        },
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Posts', // Refers to the Post table
            key: 'id',      // Refers to Post's primary key
        },
    },
});


// Associate method define karna
Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'user_id' }); 
    Comment.belongsTo(models.Post, { foreignKey: 'post_id' }); 
};

module.exports = Comment;
