const { Store, Inventory, Product, ProductVariant } = require('../../models');
const { Op } = require('sequelize');

// Create a new store
exports.createStore = async (req, res) => {
    try {
        const {
            name,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            latitude,
            longitude,
            contact_phone,
            email,
            operating_hours,
            is_dark_store,
            user_id
        } = req.body;

        const store = await Store.create({
            name,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            latitude,
            longitude,
            contact_phone,
            email,
            operating_hours,
            is_dark_store,
            user_id
        });

        res.json({ status: true, msg: "Store Added Successfully", data: store });
    } catch (error) {
        res.json({ status: false, msg: "Something went Wrong", data: error.message });
    }
};



// Get all stores
exports.getAllStores = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.body;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const whereCondition = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { city: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};


        const totalUsers = await Store.count({
            where: whereCondition
        });

        const stores = await Store.findAll({
            where: whereCondition,
            include: [
                {
                    model: Inventory,
                    include: [
                        {
                            model: Product
                        }
                    ]
                }
            ],
            limit,
            offset
        });

        const totalPages = Math.ceil(totalUsers / limit);

        res.json({
            status: true,
            totalUsers,
            totalPages,
            currentPage: page,
            limitPerPage: limit,
            data: stores
        });
    } catch (error) {
        res.json({ status: false, msg: "Something went wrong", error: error.message });
    }
};




// Get store by ID
exports.getStoreById = async (req, res) => {
    try {
        const store = await Store.findByPk(req.params.id, {
            include: [{
                model: Inventory,
                include: [{
                    model: Product,
                    include: [{
                        model: ProductVariant
                    }]
                }]
            }]
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        res.status(200).json(store);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Update store
exports.updateStore = async (req, res) => {
    try {
        const store = await Store.findByPk(req.params.id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const {
            name,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            latitude,
            longitude,
            contact_phone,
            email,
            operating_hours,
            is_dark_store,
            is_active
        } = req.body;

        await store.update({
            name,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            latitude,
            longitude,
            contact_phone,
            email,
            operating_hours,
            is_dark_store,
            is_active
        });

        res.json({ status: true, msg: "Store Updated Sucessfully", data: store });
    } catch (error) {
        res.json({ status: false, msg: "Something Went Wrong", data: error.message });
    }
};



// Delete store
exports.deleteStore = async (req, res) => {
    try {
        const store = await Store.findByPk(req.params.id);
        if (!store) {
            return res.json({ status: false, msg: 'Store not found', data: [] });
        }

        await store.destroy();
        res.json({ status: true, msg: 'Store deleted successfully', data: [] });
    } catch (error) {
        res.json({ status: false, msg: "Somthings went Wrong", error: error.message });
    }
};



exports.exportStoreslist = async (req, res) => {
    try {
        const { search = "" } = req.body;

        const whereCondition = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { city: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};

        const stores = await Store.findAll({
            where: whereCondition,
            include: [
                {
                    model: Inventory,
                    include: [
                        {
                            model: Product
                        }
                    ]
                }
            ]
        });

        res.json({
            status: true,
            totalStores: stores.length,
            data: stores
        });
    } catch (error) {
        res.json({ status: false, msg: "Something went wrong", error: error.message });
    }
};




exports.updateStoreStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id) {
            return res.json({ status: false, msg: "id is required", data: [] });
        }

        if (status === undefined || status === null) {
            return res.json({ status: false, msg: "Status is required", data: [] });
        }

        await Store.update(
            { is_active: status },
            { where: { id } }
        );

        const updatedCategory = await Store.findOne({ where: { id } });

        res.json({ status: true, msg: "Status Updated Successfully", data: updatedCategory });

    } catch (error) {
        res.json({ status: false, msg: error.message, data: [] });
    }
};



// Get nearby stores
exports.getNearbyStores = async (req, res) => {
    try {
        const { latitude, longitude, radius = 10 } = req.query;

        // Rough approximation: 1 degree = 111 kilometers
        const latDegrees = radius / 111;
        const lonDegrees = radius / (111 * Math.cos(latitude * Math.PI / 180));

        const stores = await Store.findAll({
            where: {
                latitude: {
                    [Op.between]: [Number(latitude) - latDegrees, Number(latitude) + latDegrees]
                },
                longitude: {
                    [Op.between]: [Number(longitude) - lonDegrees, Number(longitude) + lonDegrees]
                },
                is_active: true
            }
        });

        // Calculate exact distances and filter
        const nearbyStores = stores.map(store => {
            const distance = calculateDistance(
                Number(latitude),
                Number(longitude),
                store.latitude,
                store.longitude
            );
            return { ...store.toJSON(), distance };
        }).filter(store => store.distance <= radius)
            .sort((a, b) => a.distance - b.distance);

        res.status(200).json(nearbyStores);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
} 