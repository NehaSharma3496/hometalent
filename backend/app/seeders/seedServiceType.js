const ServiceType = require("../models/ServiceType");
const { Op } = require("sequelize");

const seedServiceTypes = async () => {
    const serviceTypes = [
        { name: "grocery" },
        { name: "food" },
        { name: "home_service" },
        { name: "healthcare" },
    ];

    
    for (const serviceType of serviceTypes) {
        const [type, created] = await ServiceType.findOrCreate({
        where: { name: serviceType.name },
        defaults: serviceType
        });
    
        if (created) {
        console.log(`Service Type created: ${type.name}`);
        } else {
        console.log(`Service Type already exists: ${type.name}`);
        }
    }
    }
module.exports = seedServiceTypes;