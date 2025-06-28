// seeders/seedRoles.js
const { Role } = require('../models');

async function seedRoles() {
  const roles = [
    { id: 1, role_name: 'Admin' , role: 'ADMIN', status: 1, is_disable: 1 },
    { id: 2, role_name: 'user' , role: 'USER', status: 1, is_disable: 1 },
    { id: 3, role_name: 'Retailer / Vendor', role: 'VENDOR', status: 1, is_disable: 1 },
    { id: 4, role_name: 'Service Provider' , role: 'SERVICE_PROVIDER', status: 1, is_disable: 1 },
    { id: 5, role_name: 'Doctor / Consultant Interface' , role: 'DOCTOR', status: 1, is_disable: 1 },
    { id: 6, role_name: 'Delivery Executive Interface' , role: 'DELIVERY_PARTNER', status: 1, is_disable: 1 },
  ];

  const count = await Role.count();
  if (count === 0) {
    await Role.bulkCreate(roles);
    console.log('Roles seeded successfully.');
  } else {
    console.log('Roles already exist.');
  }
}

module.exports = seedRoles;
