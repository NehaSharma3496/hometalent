const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2, // Assuming 2 is 'User'
        references: {
            model: 'roles',
            key: 'id',
        },
    },
    kyc_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    wallet_balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
    },
    gender: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
    },
    profile_picture_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,

    },
    verification_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    web_token: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    app_token: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1: Active, 0: Inactive',
    },
},
    {
        tableName: 'users',
        timestamps: true,

    });



User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'role_id' });
    User.hasMany(models.Order, { foreignKey: 'user_id' });
    User.hasMany(models.Category, { foreignKey: 'user_id' });
    User.hasMany(models.Product, { foreignKey: 'user_id' });
    User.hasMany(models.Store, { foreignKey: 'user_id' });
    User.hasMany(models.ActivityLogs, { foreignKey: 'user_id' });
    
};

module.exports = User;

