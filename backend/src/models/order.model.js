const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
    },
    quantity: {
        type: Number,
        required: true,
    },
    orderValue: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Ordered', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Ordered',
    },
    expectedDelivery: {
        type: Date,
    },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
