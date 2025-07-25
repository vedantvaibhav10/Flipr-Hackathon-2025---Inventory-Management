const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        index: true,
    },
    stockLevel: {
        type: Number,
        required: true,
        default: 0,
    },
    threshold: {
        type: Number,
        required: true,
        default: 10,
    },
    buyingPrice: {
        type: Number,
        required: [true, 'Buying price is required.'],
    },
    sellingPrice: {
        type: Number,
        required: [true, 'Selling price is required.'],
    },
    expiryDate: {
        type: Date,
    },
    image: {
        public_id: { type: String },
        url: { type: String },
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
