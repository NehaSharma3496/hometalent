const User = require('./User');
const Role = require('./Role');

const ServiceType = require('./ServiceType');


const Category = require('./Category');
const Product = require('./Product');
const ProductVariant = require('./ProductVariant');
const Inventory = require('./Inventory');
const Store = require('./Store');

const Order = require('./Order');
const OrderItem = require('./OrderItem');
const ActivityLogs = require('./ActivityLogs');


const models = {
    User: User,
    Role: Role,
    ServiceType: ServiceType,
    Category: Category,
    Product: Product,
    ProductVariant: ProductVariant,
    Inventory: Inventory,
    Store: Store,
    Order: Order,
    OrderItem: OrderItem,
    ActivityLogs: ActivityLogs
};

Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

module.exports = models;