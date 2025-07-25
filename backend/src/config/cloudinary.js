const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const colors = require('colors');

const configureCloudinary = async () => {
    await cloudinary.config({
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET,
    })
    console.log(colors.green('Cloudinary configuration successful'));
}

module.exports = configureCloudinary;