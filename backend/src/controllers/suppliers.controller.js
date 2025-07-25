const Supplier = require('../models/supplier.model');

const createSupplier = async (req, res) => {
    try {
        const { name, contactNumber, email } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Supplier name is required.' });
        }
        const supplier = await Supplier.create({ name, contactNumber, email });
        res.status(201).json({ success: true, data: supplier });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Supplier with this name already exists.' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({});
        res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        res.status(200).json({ success: true, data: supplier });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        res.status(200).json({ success: true, message: 'Supplier deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    createSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier,
};
