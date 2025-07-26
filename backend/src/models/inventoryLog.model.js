const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    actionType: {
        type: String,
        enum: ['RESTOCK', 'SALE', 'RETURN', 'DAMAGE', 'TRANSFER'],
        required: true,
    },
    quantityChange: {
        type: Number,
        required: true,
    },
    newStockLevel: {
        type: Number,
        required: true,
    },
    notes: {
        type: String,
        trim: true,
    }
}, {timestamps: true});

const InventoryLog = mongoose.model('InventoryLog', inventoryLogSchema);
module.exports = InventoryLog;
