const { Inventory, Store, Product, ProductVariant } = require('../../models');
const { logActivity }  = require('../../helper/commonFunction.js');
const { Op } = require('sequelize');

// Create inventory
exports.createInventory = async (req, res) => {
    try {
        const { store_id, product_id, variant_id, quantity, low_stock_threshold } = req.body;

        const existingInventory = await Inventory.findOne({
            where: {
                store_id,
                product_id,
                variant_id
            }
        });

        if (existingInventory) {
            return res.json({ status: false, msg: 'Inventory already exists for this product/variant in the store', data: [] });
        }

        const inventory = await Inventory.create({
            store_id,
            product_id,
            variant_id,
            quantity,
            low_stock_threshold
        });

        return res.json({ status: true, msg: "Inventory Added Syuccessfully", data: inventory });
    } catch (error) {
        return res.json({ status: true, msg: "Server ", error: error.message });
    }
};



exports.getInventorydetail = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.body;

        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const whereCondition = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                ]
            }
            : {};

        const totalUsers = await Inventory.count({ where: whereCondition });

        const data = await Inventory.findAll({
            where: whereCondition,
            offset,
            limit,
            order: [['id', 'DESC']],
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name']
                },
                {
                    model: Store,
                    attributes: ['id', 'name']
                },
                {
                    model: ProductVariant,
                    attributes: ['id', 'name']
                }
            ]
        });

        const totalPages = Math.ceil(totalUsers / limit);

        return res.json({
            status: true,
            msg: "Inventory fetched successfully",
            data,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: page,
                limitPerPage: limit
            }
        });
    } catch (error) {
        return res.json({ status: false, error: error.message });
    }
};



// Get store inventory
exports.getStoreInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findAll({
            where: { store_id: req.params.storeId },
            include: [
                {
                    model: Product,
                    include: [{
                        model: ProductVariant
                    }]
                },
                {
                    model: Store
                }
            ]
        });
        return res.json({ status: true, msg: "Inventory get Syuccessfully", data: inventory });
    } catch (error) {
        return res.json({ status: false, msg: "Inventory Added Syuccessfully", error: error.message });
    }
};



// Update inventory
exports.updateInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByPk(req.params.id);
        if (!inventory) {
            return res.json({ message: 'Inventory not found' });
        }

        const { variant_id,
            product_id,
            store_id, quantity, low_stock_threshold } = req.body;
        await inventory.update({
            variant_id,
            product_id,
            store_id,
            quantity,
            low_stock_threshold,
            last_restocked_at: quantity > inventory.quantity ? new Date() : inventory.last_restocked_at

        });

        return res.json({ status: true, msg: "Inventory Updated Syuccessfully", data: inventory });
    } catch (error) {
        return res.json({ status: true, msg: "Inventory Added Syuccessfully", error: error.message });
    }
};



// Delete inventory
exports.deleteInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByPk(req.params.id);
        if (!inventory) {
            return res.json({ status: false, msg: 'Inventory not found', data: [] });
        }

        await inventory.destroy();
        return res.json({ status: true, msg: 'Inventory deleted successfully', data: [] });
    } catch (error) {
        return res.json({ status: false, msg: "Server error", error: error.message });
    }
};



// Get low stock items
exports.getLowStockItems = async (req, res) => {
    try {
        const lowStockItems = await Inventory.findAll({
            where: {
                [Op.and]: [
                    { low_stock_threshold: { [Op.ne]: null } },
                    sequelize.where(
                        sequelize.col('quantity'),
                        '<=',
                        sequelize.col('low_stock_threshold')
                    )
                ]
            },
            include: [
                {
                    model: Product
                },
                {
                    model: Store
                },
                {
                    model: ProductVariant
                }
            ]
        });

        return res.status(200).json(lowStockItems);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Restock inventory
exports.restockInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByPk(req.params.id);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        const { quantity_to_add } = req.body;
        if (!quantity_to_add || quantity_to_add <= 0) {
            return res.status(400).json({ message: 'Invalid quantity to add' });
        }

        await inventory.update({
            quantity: inventory.quantity + quantity_to_add,
            last_restocked_at: new Date()
        });

        return res.status(200).json(inventory);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


exports.getStoredata = async (req, res) => {
    try {
        const data = await Store.findAll({
            where: {
                is_active: 1
            },
            attributes: ['id', 'name']
        });

        return res.json({ status: true, msg: "Active Store fetched successfully", data: data });
    } catch (error) {
        return res.json({ status: false, error: error.message });
    }
};


exports.getProductdata = async (req, res) => {
    try {
        const { product_id } = req.body;

        const allProducts = await Product.findAll({
            where: { is_active: 1 },
            attributes: ['id', 'name']
        });

        let productVariants = [];
        if (product_id) {
            productVariants = await ProductVariant.findAll({
                where: { product_id },
                attributes: ['id', 'name']
            });
        }

        res.json({
            status: true,
            msg: "Data fetched successfully",
            products: allProducts,
            variants: productVariants
        });
    } catch (error) {
        return res.json({ status: false, error: error.message });
    }
}

exports.updateInventoryquantity = async (req, res) => {
    
    const { variant_id, product_id, store_id, quantity, user_id} = req.body;
    try {
         let inventory;
        if(variant_id != undefined && variant_id != null && variant_id != ""){
             inventory = await Inventory.findOne({
                where: {
                    store_id,
                    product_id,
                    variant_id
                }
            });
        }else{
             inventory = await Inventory.findOne({
                where: {
                    store_id,
                    product_id
                }
            });
        } 
        
        if (!inventory) {
            return res.json({ message: 'Inventory not found' });
        }

        await inventory.update({
            quantity:inventory.quantity + quantity,
            last_restocked_at: new Date()

        });
   
        await logActivity({
            user_id,
            action: `Add quantity to inventory`,
            request: req.body,
            response: { status: true, msg: "Inventory Updated Syuccessfully", data: inventory }
        });
        
        return res.json({ status: true, msg: "Inventory Updated Syuccessfully", data: inventory });
    } catch (error) {
        await logActivity({
            user_id: user_id,
            action: `Add quantity to inventory`,
            request: req.body,
            response: { status: true, msg: "Inventory Not Updated", error: error.message }
        });
        
        return res.json({ status: true, msg: "Inventory Not Updated", error: error.message });
    }
};

