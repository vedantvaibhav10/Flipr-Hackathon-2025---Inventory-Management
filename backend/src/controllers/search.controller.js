const Product = require('../models/product.model');
const Supplier = require('../models/supplier.model');

const globalSearch = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) {
            return res.status(200).json({ success: true, data: { products: [], suppliers: [] } });
        }

        const regex = new RegExp(query, 'i');

        const [products, suppliers] = await Promise.all([
            Product.find({
                $or: [{ name: regex }, { sku: regex }]
            }).limit(5).select('name sku _id'),

            Supplier.find({ name: regex }).limit(5).select('name _id')
        ]);

        res.status(200).json({
            success: true,
            data: {
                products,
                suppliers
            }
        });

    } catch (error) {
        console.error(`Error in global search: ${error.message}`.red);
        res.status(500).json({ success: false, message: 'Server error during search.' });
    }
};

module.exports = { globalSearch };