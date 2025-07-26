const Order = require('../models/order.model');
// FIX: Add missing model imports for Product and InventoryLog
const Product = require('../models/product.model');
const InventoryLog = require('../models/inventoryLog.model');

const createOrder = async (req, res) => {
    try {
        const { product: productId, supplier, quantity, status, expectedDelivery } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ success: false, message: 'Product and quantity are required.' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        // FIX: Calculate orderValue on the backend for security and accuracy.
        const orderValue = product.buyingPrice * Number(quantity);

        const order = await Order.create({ product: productId, supplier, quantity, orderValue, status, expectedDelivery });

        // Populate the new order with details before sending back
        const populatedOrder = await Order.findById(order._id)
            .populate('product', 'name sku')
            .populate('supplier', 'name');

        res.status(201).json({ success: true, data: populatedOrder });
    } catch (error) {
        console.error(`Error creating order: ${error.message}`.red);
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
        console.error(`Error fetching orders: ${error.message}`.red);
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

        if (oldStatus === newStatus) {
            return res.status(200).json({ success: true, data: order }); // No change needed
        }

        const product = await Product.findById(order.product);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product associated with order not found' });
        }
        
        if (newStatus === 'Delivered' && oldStatus !== 'Delivered') {
            product.stockLevel += order.quantity;
            await InventoryLog.create({
                product: order.product,
                user: req.user._id,
                actionType: 'RESTOCK',
                quantityChange: order.quantity,
                newStockLevel: product.stockLevel,
                notes: `Stock received from order ID: ${order._id}`
            });
        }
    
        if (oldStatus === 'Delivered' && ['Cancelled', 'Returned'].includes(newStatus)) {
            if (product.stockLevel < order.quantity) {
                return res.status(400).json({ success: false, message: `Cannot return stock for ${product.name}. Current stock is lower than return quantity.` });
            }
            product.stockLevel -= order.quantity;
            await InventoryLog.create({
                product: order.product,
                user: req.user._id,
                actionType: 'TRANSFER',
                quantityChange: -order.quantity,
                newStockLevel: product.stockLevel,
                notes: `Stock returned to supplier from order ID: ${order._id}`
            });
        }

        order.status = newStatus;
        await product.save();
        await order.save();

        const populatedOrder = await Order.findById(order._id)
            .populate('product', 'name sku')
            .populate('supplier', 'name');

        res.status(200).json({ success: true, data: populatedOrder });

    } catch (error) {
        console.error(`Error updating order: ${error.message}`.red);
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