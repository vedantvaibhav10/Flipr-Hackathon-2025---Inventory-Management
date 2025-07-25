const Product = require('../models/product.model');
const colors = require('colors');

const createProduct = async (req, res) => {
    try {
        const {name, sku, category, stockLevel, threshold} = req.body;

        if(!name || !sku || !category){
            return res.status(400).json({ 
                success: false, 
                message: 'Name, SKU, and category are required.' 
            });
        }

        const product = await Product.create({
            name,
            sku,
            category,
            stockLevel,
            threshold
        });

        console.log(`Product created: ${product}`.blue);

        return res.status(201).json({
            success: true,
            message: 'Product created successfully.',
            data: product
        })
    }
    catch (error) {
        console.error(`Error creating product: ${error.message}`.red);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        console.log(`Fetched products: ${products.length}`.blue);
        return res.status(200).json({ 
            success: true, 
            count: products.length, 
            data: products 
        });
    }
    catch (error) {
        console.error(`Error fetching products: ${error.message}`.red);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

module.exports = {
    createProduct,
    getAllProducts
}