const User = require('./User');
const Role = require('./Role');
const Category = require('./Category');
const State = require('./State');
const City = require('./City');

const models = {
    User: User,
    Role: Role,
    Category: Category,
    City: City,
    State: State
};

Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

module.exports = models;