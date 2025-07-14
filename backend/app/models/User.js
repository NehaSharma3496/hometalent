const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    owner_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profile_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'states',
            key: 'id',
        },
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cities',
            key: 'id',
        },
    },
    pin_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    show_password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price_range: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    short_description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    experience_since: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    long_description: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    facebook_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    instagram_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    twitter_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkedin_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    youtube_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2, // Assuming 2 is 'Vendor'
        references: {
            model: 'roles',
            key: 'id',
        },
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 = pending, 1 = approved, 2 = blocked
        validate: {
            isIn: [[0, 1, 2]], // Validates that the value is either 0 or 1
        },
        comment: '0 = pending, 1 = approved, 2 = blocked',
    },
        is_sponsored: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 1 = sponsored vendor, 0 = not sponsored
        validate: {
            isIn: [[0, 1]], // Validates that the value is either 0 or 1
        },
        comment: '1 = sponsored vendor, 0 = not sponsored',
    },

    sponsor_rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 1 = sponsored vendor, 0 = not sponsored
    },  
},
    {
        tableName: 'users',
        timestamps: true,

    });



User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'role_id' });
    User.belongsTo(models.State, { foreignKey: 'state_id' });
    User.belongsTo(models.City, { foreignKey: 'city_id' });
    User.hasMany(models.Gallery, { foreignKey: 'user_id', as: 'gallery' });
    // User.hasMany(models.Order, { foreignKey: 'user_id' });
    //User.belongsTo(models.Category, { foreignKey: 'category_id' });
    // User.hasMany(models.Product, { foreignKey: 'user_id' });
    // User.hasMany(models.Store, { foreignKey: 'user_id' });
    // User.hasMany(models.ActivityLogs, { foreignKey: 'user_id' });
    
};

module.exports = User;

