const Product = require('../models/product.model');
const colors = require('colors');
const { Parser } = require('json2csv');

const getDashboardSummary = async (req, res) => {
    try {
        const summary = await Product.aggregate([
            {
                $facet: {
                    "generalStats": [
                        {
                            $group: {
                                _id: null,
                                totalProducts: { $sum: 1 },
                                totalStockValue: {$sum: "$stockLevel"}
                            }
                        },
                        {$project: {_id: 0}}
                    ],
                    "lowStockItems": [
                        {
                            $match: {
                                $expr: {
                                    $lt: ["$stockLevel", "$threshold"]
                                }
                            }
                        },
                        {$count: "count"}
                    ],
                    "stockByCategory": [
                        {
                            $group: {
                                _id: "$category",
                                totalStock: { $sum: "$stockLevel" }
                            }
                        },
                        {$sort: { totalStock: -1 }}
                    ]
                }
            }
        ]);

        const responseData = {
            totalProducts: summary[0].generalStats[0]?.totalProducts || 0,
            totalStockValue: summary[0].generalStats[0]?.totalStockValue || 0,
            lowStockCount: summary[0].lowStockItems[0]?.count || 0,
            stockByCategory: summary[0].stockByCategory,
        }

        console.log(`Dashboard summary fetched: ${JSON.stringify(responseData)}`.blue);

        return res.status(200).json({
            success: true,
            message: 'Dashboard summary fetched successfully.',
            data: responseData
        });
    }
    catch (error) {
        console.error(`Error fetching dashboard summary: ${error.message}`.red);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

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

module.exports = {
    getDashboardSummary,
    exportProducts
}