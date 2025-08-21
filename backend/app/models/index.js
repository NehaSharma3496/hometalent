const User = require('./User');
const Role = require('./Role');
const Category = require('./Category');
const State = require('./State');
const City = require('./City');
const ProfileUpdateRequest = require('./ProfileUpdateRequest');
const Gallery = require('./Gallery');
const Package = require('./Package');
const VendorPackageSubscription = require('./VendorPackageSubscription');
const ClientLead = require('./ClientLead');
const Log = require('./Log');
const VendorCategoryRank = require('./VendorCategoryRank');
const ContactUs = require('./ContactUs');
const Blog = require('./Blog');
const Review = require('./Review'); // Import the Review model
const Notification = require('./Notification');
const models = {
    User: User,
    Role: Role,
    Category: Category,
    City: City,
    State: State,
    ProfileUpdateRequest: ProfileUpdateRequest,
    Gallery: Gallery,
    Package: Package,
    VendorPackageSubscription: VendorPackageSubscription,
    ClientLead: ClientLead,
    Log: Log,
    VendorCategoryRank: VendorCategoryRank,
    ContactUs: ContactUs,
    Blog: Blog,
    Review:Review,
    Notification: Notification
};

Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

module.exports = models;