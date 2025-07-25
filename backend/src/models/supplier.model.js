const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    contactNumber: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
