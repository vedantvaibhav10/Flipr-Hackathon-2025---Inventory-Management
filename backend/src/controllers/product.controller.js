const Product = require('../models/product.model');
const colors = require('colors');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../utils/cloudinary.util');
const openai = require('../services/openai.service');

const createProduct = async (req, res) => {
    try {
        const { name, sku, category, stockLevel, threshold } = req.body;

        if (!name || !sku || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name, SKU, and category are required.'
            });
        }

        const productData = {
            name,
            sku,
            category,
            stockLevel,
            threshold
        }

        if (req.file) {
            const imageUploadResponse = await uploadOnCloudinary(req.file.path);

            if (imageUploadResponse) {
                productData.image = {
                    url: imageUploadResponse.secure_url,
                    public_id: imageUploadResponse.public_id
                }
                console.log(`Image uploaded: ${productData.image.url}`.blue);
            }
            else {
                console.error(`Image upload failed: ${imageUploadResponse}`.red);
                return res.status(500).json({
                    success: false,
                    message: 'Image upload failed.'
                });
            }
        }

        const product = await Product.create(productData);

        console.log(`Product created: ${product}`.blue);

        return res.status(201).json({
            success: true,
            message: 'Product created successfully.',
            data: product
        })
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Product with this SKU already exists.' });
        }
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

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sku, category, stockLevel, threshold } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        if (req.file) {
            if (product.image && product.image.public_id) {
                await deleteFromCloudinary(product.image.public_id);
            }
            const imageUploadResponse = await uploadOnCloudinary(req.file.path);

            if (imageUploadResponse) {
                product.image = {
                    url: imageUploadResponse.secure_url,
                    public_id: imageUploadResponse.public_id
                }
                console.log(`Image uploaded: ${product.image.url}`.blue);
            }
            else {
                console.error(`Image upload failed: ${imageUploadResponse}`.red);
                return res.status(500).json({
                    success: false,
                    message: 'Image upload failed.'
                });
            }
        }


        product.name = name || product.name;
        product.sku = sku || product.sku;
        product.category = category || product.category;
        product.stockLevel = stockLevel !== undefined ? stockLevel : product.stockLevel;
        product.threshold = threshold !== undefined ? threshold : product.threshold;

        const updatedProduct = await product.save();

        console.log(`Product updated: ${updatedProduct}`.blue);

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully.',
            data: updatedProduct
        });
    }
    catch (error) {
        console.error(`Error updating product: ${error.message}`.red);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        if (product.image && product.image.public_id) {
            await deleteFromCloudinary(product.image.public_id);
        }

        console.log(`Product deleted: ${product}`.blue);

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully.'
        });
    }
    catch (error) {
        console.error(`Error deleting product: ${error.message}`.red);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

const generateDescription = async (req, res) => {
    try {
        const { name, category } = req.body;
        if (!name || !category) {
            return res.status(400).json({ success: false, message: 'Product name and category are required.' });
        }

        const prompt = `Write a concise and professional product description for a new inventory item. The product name is '${name}' and its category is '${category}'. Keep it under 50 words.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const description = response.choices[0].message.content.trim();

        console.log(`Generated AI description: ${description}`.blue);

        return res.status(200).json({ success: true, description });

    } catch (error) {
        console.error('Error generating AI description:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate AI description.' });
    }
};

const suggestCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Product name is required.' });
        }
        const existingCategories = await Product.distinct('category');
        const prompt = `Given a new product named '${name}', suggest the best category for it from this list: [${existingCategories.join(', ')}]. Respond with only the single best category name and nothing else.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const category = response.choices[0].message.content.trim();

        console.log(`Suggested category: ${category}`.blue);

        return res.status(200).json({ success: true, suggestedCategory: category });

    } catch (error) {
        console.error('Error suggesting category:', error);
        return res.status(500).json({ success: false, message: 'Failed to suggest category.' });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    generateDescription,
    suggestCategory
}