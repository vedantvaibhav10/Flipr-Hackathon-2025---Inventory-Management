const openai = require('../services/openai.service');
const Product = require('../models/product.model');
const Supplier = require('../models/supplier.model');
const Order = require('../models/order.model');
const InventoryLog = require('../models/inventoryLog.model');

const getReorderSuggestion = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        
        const salesLogs = await InventoryLog.find({ product: productId, actionType: 'SALE' }).sort({ createdAt: -1 }).limit(50);
        const totalSold = salesLogs.reduce((acc, log) => acc + Math.abs(log.quantityChange), 0);

        const prompt = `Product '${product.name}' (SKU: ${product.sku}) is low on stock with only ${product.stockLevel} units remaining. In the recent past, ${totalSold} units were sold. Generate a concise reorder suggestion, including a recommended order quantity to maintain a 45-day supply, assuming the sales trend continues.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const suggestion = response.choices[0].message.content.trim();
        res.status(200).json({ success: true, suggestion });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate reorder suggestion.' });
    }
};

const getSupplierAnalysis = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found.' });
        }

        const orders = await Order.find({ supplier: supplierId });
        const orderSummary = {
            totalOrders: orders.length,
            delivered: orders.filter(o => o.status === 'Delivered').length,
            cancelled: orders.filter(o => o.status === 'Cancelled').length,
            returned: orders.filter(o => o.status === 'Returned').length,
        };

        const prompt = `Analyze the performance of supplier '${supplier.name}'. Their order history shows: ${orderSummary.totalOrders} total orders, with ${orderSummary.delivered} delivered, ${orderSummary.cancelled} cancelled, and ${orderSummary.returned} returned. Generate a brief, one-paragraph performance summary highlighting their reliability and mentioning any potential concerns.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const analysis = response.choices[0].message.content.trim();
        res.status(200).json({ success: true, analysis });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate supplier analysis.' });
    }
};

const getPricingSuggestion = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        const salesLogs = await InventoryLog.find({ product: productId, actionType: 'SALE' }).sort({ createdAt: -1 }).limit(50);
        const totalSold = salesLogs.reduce((acc, log) => acc + Math.abs(log.quantityChange), 0);
        const profitMargin = product.sellingPrice - product.buyingPrice;

        const prompt = `Analyze the pricing for '${product.name}'. Its current buying price is $${product.buyingPrice} and selling price is $${product.sellingPrice}, resulting in a profit margin of $${profitMargin}. It has recently sold ${totalSold} units. Is the current price optimal? Suggest if the price should be maintained, increased, or decreased to maximize profit, and provide a brief justification.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const suggestion = response.choices[0].message.content.trim();
        res.status(200).json({ success: true, suggestion });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate pricing suggestion.' });
    }
};

module.exports = {
    getReorderSuggestion,
    getSupplierAnalysis,
    getPricingSuggestion,
};
