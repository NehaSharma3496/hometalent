const { Product, Category, ProductVariant, Inventory } = require('../../models');
const { Op } = require("sequelize");

// Create a new product
exports.createVariant = async (req, res) => {
    try {
        const {
            product_id,
            name,
            value
        } = req.body;

        const product = await ProductVariant.create({
            product_id,
            name,
            value
        });

        res.json({ status: true, msg: "Variant Added Successfully", data: product });
    } catch (error) {
        res.json({ status: false, msg: "internal Error", data: error.message });
    }
};

// Get all products
exports.getAllVariants = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.body;
        const offset = (page - 1) * limit;

        const whereCondition = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { value: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};

        const { count, rows: variants } = await ProductVariant.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name']
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            status: true,
            msg: "Variants fetched successfully",
            data: variants,
            totalUsers: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            limitPerPage: parseInt(limit)
        });

    } catch (error) {
        res.json({ status: false, msg: "Internal Error", data: error.message });
    }
};

// Get product by ID
exports.getVariantById = async (req, res) => {
    try {
        const product = await ProductVariant.findByPk(req.params.id, {
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ msg: 'Variant not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.msg });
    }
};



// Update product
exports.updateVariant = async (req, res) => {
    try {
        const productvariant = await ProductVariant.findByPk(req.params.id);
        if (!productvariant) {
            return res.json({ status: false, msg: 'Variant not found' });
        }

        const {
            product_id,
            name,
            value,
            is_active
        } = req.body;

        await productvariant.update({
            product_id,
            name,
            value,
            is_active
        });

        res.json({ status: true, msg: "Variant Updated Successfully", data: productvariant });
    } catch (error) {
        res.json({ status: false, msg: "Server erorr", data: error.message });
    }
};




// Delete product
exports.deleteVariant = async (req, res) => {
    try {
        const productvariant = await ProductVariant.findByPk(req.params.id);
        if (!productvariant) {
            return res.json({ status: false, msg: 'Variant not found' });
        }

        await productvariant.destroy();
        res.json({ status: true, msg: 'Variant deleted successfully', data: [] });
    } catch (error) {
        res.json({ status: false, msg: "Server erorr", error: error.message });
    }
};




exports.updateVariantStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id) {
            return res.json({ status: false, msg: "id is required", data: [] });
        }

        if (status === undefined || status === null) {
            return res.json({ status: false, msg: "Status is required", data: [] });
        }

        const productvariant = await ProductVariant.findOne({ where: { id } });

        if (!productvariant) {
            return res.json({ status: false, msg: "Variant Not Found", data: [] });
        }

        await ProductVariant.update(
            { is_active: status },
            { where: { id } }
        );

        const updatevariant = await ProductVariant.findOne({ where: { id } });

        res.json({ status: true, msg: "Status Updated Successfully", data: updatevariant });

    } catch (error) {
        res.json({ status: false, msg: error.message, data: [] });
    }
};






exports.getExportAllVariants = async (req, res) => {
    try {
        const { search = "" } = req.body;

        const whereCondition = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { value: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};

        const products = await ProductVariant.findAll({
            where: whereCondition,
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            status: true,
            msg: "Variants fetched successfully",
            data: products,
            totalProducts: products.length
        });

    } catch (error) {
        res.json({ status: false, msg: "Internal Error", data: error.message });
    }
};



