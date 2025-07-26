const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./src/config/db');

// Load Models
const Product = require('./src/models/product.model');
const User = require('./src/models/user.model');
const InventoryLog = require('./src/models/inventoryLog.model');

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

// Function to import data
const seedLogs = async () => {
    try {
        // Clear existing logs
        await InventoryLog.deleteMany();

        const products = await Product.find();
        const users = await User.find();

        if (products.length === 0 || users.length === 0) {
            console.error('Error: Please create at least one product and one user before seeding logs.'.red.inverse);
            process.exit();
        }

        const logs = [];
        const actionTypes = ['RESTOCK', 'SALE', 'RETURN', 'DAMAGE', 'TRANSFER'];
        const notesPool = [
            'Manual count adjustment',
            'Order #ORD-1234 fulfilled',
            'Stock received from Main Supplier',
            'Expired items removed from shelf',
            'Customer return, item unopened',
            'Transfer to Warehouse B',
            'Promotional sale event item'
        ];

        // Create 50 random log entries
        for (let i = 0; i < 50; i++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomAction = actionTypes[Math.floor(Math.random() * actionTypes.length)];
            const randomNote = notesPool[Math.floor(Math.random() * notesPool.length)];

            let quantityChange;
            if (['SALE', 'DAMAGE'].includes(randomAction)) {
                quantityChange = -Math.floor(Math.random() * 20 + 1); // e.g., -1 to -20
            } else {
                quantityChange = Math.floor(Math.random() * 50 + 5); // e.g., 5 to 55
            }

            logs.push({
                product: randomProduct._id,
                user: randomUser._id,
                actionType: randomAction,
                quantityChange: quantityChange,
                // For seeding, a random new stock level is sufficient to test display
                newStockLevel: Math.floor(Math.random() * 100 + 20),
                notes: randomNote,
                // Create log at a random time in the last 30 days
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            });
        }

        await InventoryLog.insertMany(logs);

        console.log('✅ Inventory logs seeded successfully!'.green.inverse);
        process.exit();

    } catch (err) {
        console.error(`${err}`.red.inverse);
        process.exit(1);
    }
}

// Function to destroy data
const destroyData = async () => {
    try {
        await InventoryLog.deleteMany();
        console.log('🔥 Inventory logs destroyed successfully!'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(`${err}`.red.inverse);
        process.exit(1);
    }
}

// Command line argument logic
if (process.argv[2] === '-i') {
    seedLogs();
} else if (process.argv[2] === '-d') {
    destroyData();
} else {
    console.log('Please use an argument to run the seeder:');
    console.log('-i : to import data'.cyan);
    console.log('-d : to destroy data'.cyan);
    process.exit();
}