const { Product, Category, ProductVariant, Inventory } = require('../../models');
const { Op } = require("sequelize");

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const {
            category_id,
            name,
            description,
            brand,
            mrp,
            selling_price,
            discount_percentage,
            tax_percentage,
            weight,
            weight_unit,
            inventory_type,
            is_vegetarian,
            is_vegan,
            is_returnable,
            return_period,
            country_of_origin,
            shelf_life,
            image_url,
            display_order,
            user_id
        } = req.body;

        const product = await Product.create({
            category_id,
            name,
            description,
            brand,
            mrp,
            selling_price,
            discount_percentage,
            tax_percentage,
            weight,
            weight_unit,
            inventory_type,
            is_vegetarian,
            is_vegan,
            is_returnable,
            return_period,
            country_of_origin,
            shelf_life,
            image_url,
            display_order,
            user_id
        });

        res.json({ status: true, msg: "Product Added Successfully", data: product });
    } catch (error) {
        res.json({ status: false, msg: "internal Error", data: error.message });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.body;
        const offset = (page - 1) * limit;

        const whereCondition = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { brand: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereCondition,
            include: [
                { model: Category },
                { model: ProductVariant }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            status: true,
            msg: "Products fetched successfully",
            data: products,
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
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                {
                    model: Category
                },
                {
                    model: ProductVariant
                },
                {
                    model: Inventory
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.msg });
    }
};



// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.json({ message: 'Product not found' });
        }

        const {
            category_id,
            name,
            description,
            brand,
            mrp,
            selling_price,
            discount_percentage,
            tax_percentage,
            weight,
            weight_unit,
            inventory_type,
            is_vegetarian,
            is_vegan,
            is_returnable,
            return_period,
            country_of_origin,
            shelf_life,
            image_url,
            display_order,
            is_active
        } = req.body;

        await product.update({
            category_id,
            name,
            description,
            brand,
            mrp,
            selling_price,
            discount_percentage,
            tax_percentage,
            weight,
            weight_unit,
            inventory_type,
            is_vegetarian,
            is_vegan,
            is_returnable,
            return_period,
            country_of_origin,
            shelf_life,
            image_url,
            display_order,
            is_active
        });

        res.json({ status: true, msg: "Product Updated Successfully", data: product });
    } catch (error) {
        res.json({ status: false, msg: "Server erorr", data: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.json({ status: false, msg: 'Product not found' });
        }

        await product.destroy();
        res.json({ status: true, msg: 'Product deleted successfully', data: [] });
    } catch (error) {
        res.json({ status: false, msg: "Server erorr", error: error.message });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { category_id: req.params.categoryId },
            include: [
                {
                    model: ProductVariant
                }
            ]
        });
        res.json({ status: true, msg: "get data successfully", data: products });
    } catch (error) {
        res.json({ status: false, msg: "server error ", error: error.message });
    }
};


exports.updateProductStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id) {
            return res.json({ status: false, msg: "id is required", data: [] });
        }

        if (status === undefined || status === null) {
            return res.json({ status: false, msg: "Status is required", data: [] });
        }

        const category = await Product.findOne({ where: { id } });

        if (!category) {
            return res.json({ status: false, msg: "Product Not Found", data: [] });
        }

        await Product.update(
            { is_active: status },
            { where: { id } }
        );

        const updatedCategory = await Product.findOne({ where: { id } });

        res.json({ status: true, msg: "Status Updated Successfully", data: updatedCategory });

    } catch (error) {
        res.json({ status: false, msg: error.message, data: [] });
    }
};



exports.getExportAllProducts = async (req, res) => {
    try {
        const { search = "" } = req.body;

        const whereCondition = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { brand: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};

        const products = await Product.findAll({
            where: whereCondition,
            include: [
                { model: Category },
                { model: ProductVariant }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            status: true,
            msg: "Products fetched successfully",
            data: products,
            totalProducts: products.length
        });

    } catch (error) {
        res.json({ status: false, msg: "Internal Error", data: error.message });
    }
};


// Add product variant
exports.addProductVariant = async (req, res) => {
    try {
        const { name, value } = req.body;
        const variant = await ProductVariant.create({
            product_id: req.params.productId,
            name,
            value
        });
        res.status(201).json(variant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get product variants
exports.getProductVariants = async (req, res) => {
    try {
        const variants = await ProductVariant.findAll({
            where: { product_id: req.params.productId }
        });
        res.status(200).json(variants);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update product variant
exports.updateProductVariant = async (req, res) => {
    try {
        const variant = await ProductVariant.findByPk(req.params.variantId);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        const { name, value, is_active } = req.body;
        await variant.update({ name, value, is_active });
        res.status(200).json(variant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete product variant
exports.deleteProductVariant = async (req, res) => {
    try {
        const variant = await ProductVariant.findByPk(req.params.variantId);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        await variant.destroy();
        res.status(200).json({ message: 'Variant deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 