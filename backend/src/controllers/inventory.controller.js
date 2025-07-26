const Product = require('../models/product.model');
const InventoryLog = require('../models/inventoryLog.model');
const sendEmail = require('../services/email.service');
const colors = require('colors');
const openai = require('../services/openai.service');

const updateStock = async (req, res) => {
    try {
        const { productId, actionType, notes } = req.body;
        const quantity = Number(req.body.quantity);
        const userId = req.user._id;

        if (!productId || !actionType || !quantity || isNaN(quantity)) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, action type, and a valid quantity are required.'
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        let newStockLevel = product.stockLevel;

        if (['SALE', 'DAMAGE', 'TRANSFER_OUT'].includes(actionType)) {
            if (product.stockLevel < quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Not enough stock for this action.'
                });
            }
            newStockLevel -= quantity;
        }
        else if (['RESTOCK', 'RETURN', 'TRANSFER_IN'].includes(actionType)) {
            newStockLevel += quantity;
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Invalid action type.'
            });
        }

        product.stockLevel = newStockLevel;
        const updatedProduct = await product.save();

        console.log(`Product stock updated: ${updatedProduct}`.blue);

        const subtractionActions = ['SALE', 'DAMAGE', 'TRANSFER_OUT'];
        const quantityChangeValue = subtractionActions.includes(actionType) ? -quantity : quantity;

        await InventoryLog.create({
            product: productId,
            user: userId,
            actionType,
            quantityChange: quantityChangeValue,
            newStockLevel: product.stockLevel,
            notes: notes || ''
        });

        if (product.stockLevel < product.threshold) {
            const prompt = `Draft a concise low-stock alert email body. The product '${product.name}' (SKU: ${product.sku}) is critically low. Current stock is ${product.stockLevel}, but the threshold is ${product.threshold}. Emphasize the urgency and recommend an immediate reorder.`;

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
            });

            const subject = `URGENT: Low Stock Alert for ${product.name}`;
            const htmlContent = `<p>${response.choices[0].message.content.trim()}</p>`;
            await sendEmail(process.env.ADMIN_EMAIL, subject, htmlContent);
        }

        return res.status(200).json({
            success: true,
            message: 'Stock updated successfully.',
            data: updatedProduct
        });
    }
    catch (error) {
        console.error(`Error updating stock: ${error.message}`.red);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

const getInventoryLogs = async (req, res) => {
    try {
        const filter = {};
        if (req.query.productId) filter.product = req.query.productId;
        if (req.query.userId) filter.user = req.query.userId;
        if (req.query.actionType) filter.actionType = req.query.actionType;

        const logs = await InventoryLog.find(filter)
            .populate('product', 'name sku')
            .populate('user', 'name email');

        console.log(`Inventory logs retrieved: ${logs.length}`.blue);

        return res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    }
    catch (error) {
        console.error(`Error retrieving inventory logs: ${error.message}`.red);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

module.exports = {
    updateStock,
    getInventoryLogs
};