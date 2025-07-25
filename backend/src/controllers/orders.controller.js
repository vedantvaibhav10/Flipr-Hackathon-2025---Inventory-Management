const Order = require('../models/order.model');

const createOrder = async (req, res) => {
    try {
        const { product, supplier, quantity, orderValue, status, expectedDelivery } = req.body;
        if (!product || !quantity || !orderValue) {
            return res.status(400).json({ success: false, message: 'Product, quantity, and order value are required.' });
        }
        const order = await Order.create({ product, supplier, quantity, orderValue, status, expectedDelivery });
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('product', 'name sku')
            .populate('supplier', 'name');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const oldStatus = order.status;
        const newStatus = req.body.status;

        Object.assign(order, req.body);
        const updatedOrder = await order.save();

        if (newStatus === 'Delivered' && oldStatus !== 'Delivered') {
            const product = await Product.findById(order.product);
            if (product) {
                product.stockLevel += order.quantity;
                await product.save();

                await InventoryLog.create({
                    product: order.product,
                    user: req.user._id,
                    actionType: 'RESTOCK',
                    quantityChange: order.quantity,
                    notes: `From order ID: ${order._id}`
                });
            }
        }

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error(`Error updating order: ${error.message}`);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, message: 'Order deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder,
};
