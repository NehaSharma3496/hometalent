const seedRoles = require('./seedRoles');
// const seedServiceTypes = require('./seedServiceType');
// const seedPermissions = require('./seedPermissions');

async function seedAll() {
  await seedRoles();
  // await seedServiceTypes();
    // await seedPermissions();
    
}

module.exports = seedAll;