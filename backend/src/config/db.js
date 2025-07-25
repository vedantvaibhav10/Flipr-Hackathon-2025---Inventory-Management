const mongoose = require('mongoose');
require('dotenv').config();
const colors = require('colors');

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${connectionInstance.connection.host}`.green);
    } catch (error) {
        console.error(`Error: ${error.message}`.red);
        process.exit(1);
    }
}

module.exports = connectDB;