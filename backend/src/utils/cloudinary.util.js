const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const colors = require('colors');

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log(`File uploaded to Cloudinary: ${response.secure_url}`.blue);

        fs.unlinkSync(localFilePath);
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath);
        console.error(`Error uploading file to Cloudinary: ${error.message}`.red);
        return null;
    }
}

const deleteFromCloudinary = async (public_id) => {
    try {
        if(!public_id) return null;

        const response = await cloudinary.uploader.destroy(public_id);
        console.log(`File deleted from Cloudinary: ${response}`.blue);
        return response;
    }
    catch (error) {
        console.error(`Error deleting file from Cloudinary: ${error.message}`.red);
        return null;
    }
}

module.exports = { uploadOnCloudinary, deleteFromCloudinary };
