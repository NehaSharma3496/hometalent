const { Order, Store, Product, Inventory, User } = require('../../models');
const { Op } = require('sequelize');
const sequelize = require('../../config/db.config');

// Create a new order
exports.createOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            user_id,
            delivery_address,
            items,
            payment_method,
            delivery_latitude,
            delivery_longitude
        } = req.body;

        // Create order
        const order = await Order.create({
            user_id,
            delivery_address,
            delivery_latitude,
            delivery_longitude,
            status: 'PENDING',
            payment_method,
            total_amount: 0 // Will be calculated based on items
        }, { transaction });

        // Calculate total and check inventory
        let totalAmount = 0;
        for (const item of items) {
            const inventory = await Inventory.findOne({
                where: {
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: {
                        [Op.gte]: item.quantity
                    }
                }
            }, { transaction });

            if (!inventory) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Insufficient inventory for some items' });
            }

            const product = await Product.findByPk(item.product_id);
            totalAmount += product.selling_price * item.quantity;

            // Create order item
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price: product.selling_price,
                subtotal: product.selling_price * item.quantity
            }, { transaction });
        }

        // Update order total
        await order.update({ total_amount: totalAmount }, { transaction });

        // Find nearest available vendors with subscription
        const vendors = await findEligibleVendors(delivery_latitude, delivery_longitude);
        
        if (vendors.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'No eligible vendors found nearby' });
        }

        // Assign to first eligible vendor
        await assignOrderToVendor(order.id, vendors[0].id, transaction);

        await transaction.commit();
        res.status(201).json(order);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Find eligible vendors based on subscription and location
async function findEligibleVendors(latitude, longitude, radius = 3) {
    const vendors = await Store.findAll({
        where: {
            is_active: true,
            subscription_status: 'ACTIVE', // Check for active subscription
            latitude: {
                [Op.between]: [
                    Number(latitude) - (radius / 111),
                    Number(latitude) + (radius / 111)
                ]
            },
            longitude: {
                [Op.between]: [
                    Number(longitude) - (radius / (111 * Math.cos(latitude * Math.PI / 180))),
                    Number(longitude) + (radius / (111 * Math.cos(latitude * Math.PI / 180)))
                ]
            }
        },
        order: [
            ['subscription_tier', 'DESC'], // Premium subscribers first
            [sequelize.literal('POWER(latitude - ' + latitude + ', 2) + POWER(longitude - ' + longitude + ', 2)'), 'ASC'] // Then by distance
        ]
    });

    return vendors;
}

// Assign order to vendor
async function assignOrderToVendor(orderId, vendorId, transaction) {
    await Order.update(
        {
            assigned_vendor_id: vendorId,
            status: 'ASSIGNED',
            assigned_at: new Date()
        },
        {
            where: { id: orderId },
            transaction
        }
    );
}

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product
                        }
                    ]
                },
                {
                    model: Store,
                    as: 'vendor'
                },
                {
                    model: User
                }
            ]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product
                        }
                    ]
                },
                {
                    model: Store,
                    as: 'vendor'
                },
                {
                    model: User
                }
            ]
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);
        
        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.update({ status }, { transaction });

        // If order is rejected by current vendor, try to assign to next eligible vendor
        if (status === 'REJECTED') {
            const vendors = await findEligibleVendors(order.delivery_latitude, order.delivery_longitude);
            const eligibleVendors = vendors.filter(v => v.id !== order.assigned_vendor_id);
            
            if (eligibleVendors.length > 0) {
                await assignOrderToVendor(order.id, eligibleVendors[0].id, transaction);
            } else {
                await order.update({ status: 'UNASSIGNED' }, { transaction });
            }
        }

        await transaction.commit();
        res.status(200).json(order);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Get store orders
exports.getStoreOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { store_id: req.params.storeId },
            include: [
                {
                    model: OrderItem,
                    include: [{ model: Product }]
                }
            ]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get vendor orders
exports.getVendorOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { assigned_vendor_id: req.params.vendorId },
            include: [
                {
                    model: OrderItem,
                    include: [{ model: Product }]
                },
                {
                    model: User
                }
            ]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Accept order
exports.acceptOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.assigned_vendor_id !== req.user.vendor_id) {
            await transaction.rollback();
            return res.status(403).json({ message: 'Not authorized to accept this order' });
        }

        await order.update({
            status: 'ACCEPTED',
            accepted_at: new Date()
        }, { transaction });

        await transaction.commit();
        res.status(200).json(order);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Reject order
exports.rejectOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.assigned_vendor_id !== req.user.vendor_id) {
            await transaction.rollback();
            return res.status(403).json({ message: 'Not authorized to reject this order' });
        }

        // Find next eligible vendor
        const vendors = await findEligibleVendors(order.delivery_latitude, order.delivery_longitude);
        const eligibleVendors = vendors.filter(v => v.id !== order.assigned_vendor_id);

        if (eligibleVendors.length > 0) {
            await assignOrderToVendor(order.id, eligibleVendors[0].id, transaction);
        } else {
            await order.update({
                status: 'UNASSIGNED',
                assigned_vendor_id: null
            }, { transaction });
        }

        await transaction.commit();
        res.status(200).json(order);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Get available orders nearby
exports.getAvailableOrdersNearby = async (req, res) => {
    try {
        const { latitude, longitude, radius = 3 } = req.query;
        const orders = await Order.findAll({
            where: {
                status: 'UNASSIGNED',
                delivery_latitude: {
                    [Op.between]: [
                        Number(latitude) - (radius / 111),
                        Number(latitude) + (radius / 111)
                    ]
                },
                delivery_longitude: {
                    [Op.between]: [
                        Number(longitude) - (radius / (111 * Math.cos(latitude * Math.PI / 180))),
                        Number(longitude) + (radius / (111 * Math.cos(latitude * Math.PI / 180)))
                    ]
                }
            },
            include: [
                {
                    model: OrderItem,
                    include: [{ model: Product }]
                }
            ]
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 