const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcrypt');
const connectDB = require('./src/config/db');

// Load Models
const User = require('./src/models/user.model');
const Product = require('./src/models/product.model');
const Supplier = require('./src/models/supplier.model');
const Order = require('./src/models/order.model');
const InventoryLog = require('./src/models/inventoryLog.model');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        // Clear all existing data
        await User.deleteMany();
        await Supplier.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();
        await InventoryLog.deleteMany();

        // --- Create Users ---
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('123456', salt);
        const staffPassword = await bcrypt.hash('123456', salt);

        const users = await User.insertMany([
            { name: 'Admin User', email: 'admin@example.com', password: adminPassword, role: 'Admin', isVerified: true },
            { name: 'Staff User', email: 'staff@example.com', password: staffPassword, role: 'Staff', isVerified: true },
        ]);
        const adminUser = users[0];

        // --- Create Suppliers ---
        const suppliers = await Supplier.insertMany([
            { name: 'Global Tech Supplies', contactNumber: '111-222-3333', email: 'contact@gts.com' },
            { name: 'Office Essentials Co.', contactNumber: '444-555-6666', email: 'sales@officeco.net' },
            { name: 'Organic Foods Inc.', contactNumber: '777-888-9999', email: 'orders@organicfoods.com' },
        ]);

        // --- Create Products ---
        const products = await Product.insertMany([
            { name: 'Wireless Mouse', sku: 'WM-101', category: 'Electronics', stockLevel: 5, threshold: 10, buyingPrice: 15.50, sellingPrice: 29.99, supplier: suppliers[0]._id },
            { name: 'Laptop Stand', sku: 'LS-202', category: 'Accessories', stockLevel: 30, threshold: 15, buyingPrice: 25.00, sellingPrice: 45.00, supplier: suppliers[0]._id },
            { name: 'A4 Paper Ream', sku: 'AP-303', category: 'Stationery', stockLevel: 150, threshold: 50, buyingPrice: 5.00, sellingPrice: 9.50, supplier: suppliers[1]._id },
            { name: 'Organic Coffee Beans', sku: 'OCB-404', category: 'Groceries', stockLevel: 8, threshold: 20, buyingPrice: 12.00, sellingPrice: 22.99, supplier: suppliers[2]._id },
            { name: 'Mechanical Keyboard', sku: 'MK-505', category: 'Electronics', stockLevel: 25, threshold: 10, buyingPrice: 80.00, sellingPrice: 139.99, supplier: suppliers[0]._id },
        ]);

        // --- Create Orders ---
        const orders = await Order.insertMany([
            { product: products[0]._id, supplier: suppliers[0]._id, quantity: 50, orderValue: 775, status: 'Delivered' },
            { product: products[1]._id, supplier: suppliers[0]._id, quantity: 30, orderValue: 750, status: 'Shipped' },
            { product: products[3]._id, supplier: suppliers[2]._id, quantity: 25, orderValue: 300, status: 'Ordered' },
            { product: products[2]._id, supplier: suppliers[1]._id, quantity: 100, orderValue: 500, status: 'Cancelled' },
            { product: products[0]._id, supplier: suppliers[0]._id, quantity: 20, orderValue: 310, status: 'Delivered' },
        ]);

        // --- Create Inventory Logs ---
        const logs = [];
        for (const product of products) {
            // Initial stock log
            logs.push({ product: product._id, user: adminUser._id, actionType: 'RESTOCK', quantityChange: product.stockLevel, newStockLevel: product.stockLevel, notes: 'Initial stock count' });
            // Simulate some sales
            for (let i = 0; i < 5; i++) {
                const saleQty = Math.floor(Math.random() * 5) + 1;
                logs.push({ product: product._id, user: adminUser._id, actionType: 'SALE', quantityChange: -saleQty, newStockLevel: product.stockLevel - saleQty, notes: `Fulfilled order #${Math.floor(Math.random() * 1000)}` });
            }
        }
        await InventoryLog.insertMany(logs);

        console.log('✅✅✅ Data Imported Successfully! ✅✅✅'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`.red.inverse);
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Supplier.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();
        await InventoryLog.deleteMany();
        console.log('🔥🔥🔥 Data Destroyed Successfully! 🔥🔥🔥'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`.red.inverse);
        process.exit(1);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    destroyData();
} else {
    console.log('Please use an argument to run the seeder:');
    console.log('-i : to import data'.cyan);
    console.log('-d : to destroy data'.cyan);
    process.exit();
}