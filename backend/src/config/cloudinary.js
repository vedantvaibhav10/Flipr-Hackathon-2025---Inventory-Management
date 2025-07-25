const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const colors = require('colors');

const configureCloudinary = async () => {
    try{
        console.log('Cloudinary variables:'.yellow);
        console.log({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET ? '******' : undefined
        });
        await cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        })
        console.log(colors.green('Cloudinary configuration successful'));
    }
    catch (error) {
        console.error(colors.red('Error configuring Cloudinary:', error.message));
    }
}

module.exports = configureCloudinary;