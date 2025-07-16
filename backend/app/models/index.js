const User = require('./User');
const Role = require('./Role');
const Category = require('./Category');
const State = require('./State');
const City = require('./City');
const ProfileUpdateRequest = require('./ProfileUpdateRequest');
const Gallery = require('./Gallery');

const models = {
    User: User,
    Role: Role,
    Category: Category,
    City: City,
    State: State,
    ProfileUpdateRequest: ProfileUpdateRequest,
    Gallery: Gallery
};

Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

module.exports = models;