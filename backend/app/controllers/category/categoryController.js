const { Category, Product, ServiceType } = require('../../models');
const { Op } = require("sequelize");

exports.listServiceType = async (req, res) => {
    try {

        const serviceTypes = await ServiceType.findAll({
            attributes: ['id', 'name']
        });
        res.status(200).json(serviceTypes);
    } catch (error) {
        console.log("err", error)
        res.status(400).json({ error: error.message });
    }
};



// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description, parent_category_id, image_url, display_order, service_type, user_id } = req.body;

        const category = await Category.create({
            name,
            description,
            parent_category_id,
            image_url,
            display_order,
            service_type,
            user_id
        });
        res.json({ status: true, msg: "Category Add Successfully", data: [] });
    } catch (error) {
        res.json({ status: false, msg: "Server error", data: error.message });
    }
};



// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.body;

        const offset = (page - 1) * limit;

        const whereCondition = {};
        if (search) {
            whereCondition.name = {
                [Op.like]: `%${search}%`
            };
        }

        const { count, rows: categories } = await Category.findAndCountAll({
            include: [
                {
                    model: Category,
                    as: 'subcategories',
                    include: [
                        { model: Product }
                    ]
                },
                {
                    model: Category,
                    as: 'parentCategory',
                    attributes: ['id', 'name']
                },
                { model: ServiceType },

            ],
            where: whereCondition,
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
        });

        res.json({
            status: true,
            msg: "Category get Successfully",
            data: categories,
            totalUsers: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            limitPerPage: parseInt(limit)
        });
    } catch (error) {
        res.json({ status: false, error: error.message });
    }
};


// Get all categories

exports.getParentCategory = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: {
                parent_category_id: {
                    [Op.is]: null
                }
            },
            attributes: ['id', 'name']
        });

        res.json({ status: true, msg: "Categories fetched successfully", data: categories });
    } catch (error) {
        res.json({ error: error.message });
    }
};



exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: {
                is_active: 1
            },
            attributes: ['id', 'name']
        });

        res.json({ status: true, msg: "Active categories fetched successfully", data: categories });
    } catch (error) {
        res.json({ status: false, error: error.message });
    }
};



// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [
                {
                    model: Category,
                    as: 'subcategories'
                },
                {
                    model: Product
                }
            ]
        });
        if (!category) {
            return res.json({ message: 'Category not found ' });
        }
        res.json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Update category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.json({ status: false, msg: 'Category not found ', data: [] });
        }

        const { name, description, parent_category_id, image_url, display_order, service_type, is_active } = req.body;
        await category.update({
            name,
            description,
            parent_category_id,
            image_url,
            display_order,
            service_type,
            is_active
        });

        res.json({ status: true, msg: 'Updated Successfull', data: category });
    } catch (error) {
        res.json({ status: false, msg: 'internal Server', data: error.message });
    }
};


// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.json({ status: false, msg: 'Category not found ', data: [] });
        }

        const hasSubcategories = await Category.count({
            where: { parent_category_id: req.params.id }
        });

        // if (hasSubcategories > 0) {
        //     return res.json({ status: false, msg: 'Subcategories required', data: [] });
        // }
        await category.destroy();
        res.json({ status: true, msg: 'Category deleted successfully', data: [] });
    } catch (error) {
        res.json({ status: false, msg: 'Internal error', data: error.message });
    }
};



// Get subcategories
exports.getSubcategories = async (req, res) => {
    try {
        const subcategories = await Category.findAll({
            where: { parent_category_id: req.params.id },
            include: [{
                model: Product
            }]
        });
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.updateCategoryStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id) {
            return res.json({ status: false, msg: "id is required", data: [] });
        }

        if (status === undefined || status === null) {
            return res.json({ status: false, msg: "Status is required", data: [] });
        }

        const category = await Category.findOne({ where: { id } });

        if (!category) {
            return res.json({ status: false, msg: "Category Not Found", data: [] });
        }

        await Category.update(
            { is_active: status },
            { where: { id } }
        );

        const updatedCategory = await Category.findOne({ where: { id } });

        res.json({ status: true, msg: "Status Updated Successfully", data: updatedCategory });

    } catch (error) {
        res.json({ status: false, msg: error.message, data: [] });
    }
};


exports.exportAllCategories = async (req, res) => {
    try {
        const { search = '' } = req.body;

        const whereCondition = {};
        if (search) {
            whereCondition.name = {
                [Op.like]: `%${search}%`
            };
        }

        const categories = await Category.findAll({
            include: [
                {
                    model: Category,
                    as: 'subcategories',
                    include: [
                        { model: Product }
                    ]
                },
                {
                    model: Category,
                    as: 'parentCategory',
                    attributes: ['id', 'name']
                },
                { model: ServiceType },
            ],
            where: whereCondition
        });

        res.json({
            status: true,
            msg: "Category get Successfully",
            data: categories
        });
    } catch (error) {
        res.json({ status: false, error: error.message });
    }
};
