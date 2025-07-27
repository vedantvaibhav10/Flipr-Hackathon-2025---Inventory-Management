const Product = require('../models/product.model');
const colors = require('colors');
const { Parser } = require('json2csv');
const InventoryLog = require('../models/inventoryLog.model');
const openai = require('../services/openai.service');
const Order = require('../models/order.model');

const getDashboardSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        const productStats = await Product.aggregate([
            {
                $facet: {
                    "general": [
                        { $group: { _id: null, totalProducts: { $sum: 1 }, totalStockValue: { $sum: { $multiply: ["$stockLevel", "$buyingPrice"] } } } },
                        { $project: { _id: 0 } }
                    ],
                    "lowStock": [
                        { $match: { $expr: { $lt: ["$stockLevel", "$threshold"] } } },
                        { $count: "count" }
                    ],
                    "stockByCategory": [
                        {
                            $group: {
                                _id: "$category",
                                totalStock: { $sum: "$stockLevel" }
                            }
                        }
                    ],
                    "categories": [
                        { $group: { _id: "$category", count: { $sum: 1 } } },
                        { $project: { _id: 0, name: "$_id", count: 1 } }
                    ]
                }
            }
        ]);

        const salesStats = await InventoryLog.aggregate([
            { $match: { actionType: 'SALE' } },
            { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'productDetails' } },
            { $unwind: '$productDetails' },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: { $abs: "$quantityChange" } },
                    totalRevenue: { $sum: { $multiply: [{ $abs: "$quantityChange" }, "$productDetails.sellingPrice"] } },
                    totalCost: { $sum: { $multiply: [{ $abs: "$quantityChange" }, "$productDetails.buyingPrice"] } }
                }
            },
            { $project: { _id: 0, totalSales: 1, totalRevenue: 1, totalProfit: { $subtract: ["$totalRevenue", "$totalCost"] } } }
        ]);

        const purchaseStats = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    totalValue: { $sum: "$orderValue" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedPurchaseStats = purchaseStats.reduce((acc, item) => {
            acc[item._id.toLowerCase()] = { value: item.totalValue, count: item.count };
            return acc;
        }, {});


        const summary = {
            totalProducts: productStats[0].general[0]?.totalProducts || 0,
            totalStockValue: productStats[0].general[0]?.totalStockValue || 0,
            lowStockCount: productStats[0].lowStock[0]?.count || 0,
            stockByCategory: productStats[0].stockByCategory,
            inventorySummary: {
                quantityInHand: productStats[0].general[0]?.totalStockValue || 0,
                toBeReceived: formattedPurchaseStats.ordered?.count || 0,
            },
            productSummary: {
                numberOfCategories: productStats[0].categories.length || 0,
                totalProducts: productStats[0].general[0]?.totalProducts || 0,
            },
            salesOverview: {
                sales: salesStats[0]?.totalSales || 0,
                revenue: salesStats[0]?.totalRevenue || 0,
                profit: salesStats[0]?.totalProfit || 0,
                cost: salesStats[0]?.totalCost || 0,
            },
            purchaseOverview: {
                purchase: (formattedPurchaseStats.delivered?.count || 0) + (formattedPurchaseStats.shipped?.count || 0),
                cost: (formattedPurchaseStats.delivered?.value || 0) + (formattedPurchaseStats.shipped?.value || 0),
                cancel: formattedPurchaseStats.cancelled?.count || 0,
                return: formattedPurchaseStats.returned?.count || 0,
            },
        };

        res.status(200).json({ success: true, data: summary });

    } catch (error) {
        console.error(`Error generating dashboard summary: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const exportProducts = async (req, res) => {
    try {
        const products = await Product.find({}).lean();

        const fields = ['sku', 'name', 'category', 'stockLevel', 'threshold', 'createdAt', 'updatedAt'];
        const opts = { fields };

        const parser = new Parser(opts);
        const csv = parser.parse(products);

        console.log(`Products exported: ${products.length}`.blue);

        res.header('Content-Type', 'text/csv');
        res.attachment('products-export.csv');
        return res.send(csv);

    } catch (error) {
        console.error(`Error exporting products: ${error.message}`.red);
        res.status(500).send('Error exporting data');
    }
};

const getProductForecast = async (req, res) => {
    try {
        const { id } = req.params;
        const salesLogs = await InventoryLog.find({ product: id, actionType: 'SALE' }).sort({ createdAt: -1 }).limit(100);

        if (salesLogs.length < 5) {
            return res.status(400).json({ success: false, message: 'Not enough sales data to generate a forecast.' });
        }

        const salesDataString = salesLogs.map(log => `Date: ${log.createdAt.toISOString().split('T')[0]}, Quantity: ${-log.quantityChange}`).join('; ');

        const prompt = `Based on the following recent sales data for a product: "${salesDataString}". Analyze the trend and predict the likely sales demand for the next 30 days. Provide a short, one-paragraph summary.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const forecast = response.choices[0].message.content.trim();

        console.log(`Generated forecast: ${forecast}`.blue);

        return res.status(200).json({ success: true, forecast });

    } catch (error) {
        console.error('Error generating forecast:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate forecast.' });
    }
};

module.exports = {
    getDashboardSummary,
    exportProducts,
    getProductForecast
}