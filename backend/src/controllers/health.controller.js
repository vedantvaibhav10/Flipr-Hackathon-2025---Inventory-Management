const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const colors = require('colors');

const checkHealth = async (req, res) => {
    const healthStatus = {
        server: {
            status: 'ok',
            message: 'Server is running smoothly'
        },
        database: {
            status: 'ok',
            message: 'Database connection is healthy'
        },
        cloudinary: {
            status: 'ok',
            message: 'Cloudinary is connected'
        },
        uptime: process.uptime(),
    }

    try {
        if(mongoose.connection.readyState === 1){
            healthStatus.database.status = 'ok';
            healthStatus.database.message = 'Database connection is healthy';
        }
    }
    catch(error) {
        healthStatus.database.status = 'error';
        healthStatus.database.message = `Database connection error: ${error.message}`;
        console.error(`Database connection error: ${error.message}`.red);
    }

    try{
        const cloudinaryPing = await cloudinary.api.ping();
        if (cloudinaryPing.status === 'ok') {
            healthStatus.cloudinary.status = 'ok';
            healthStatus.cloudinary.message = 'Cloudinary is connected.';
        }
    }
    catch(error) {
        healthStatus.cloudinary.status = 'error';
        healthStatus.cloudinary.message = `Cloudinary connection error: ${error.message}`;
        console.error(`Cloudinary connection error: ${error.message}`.red);
    }

    const isHealthy = healthStatus.database.status === 'ok' && healthStatus.cloudinary.status === 'ok';
    const statusCode = isHealthy ? 200 : 503;

    console.log(`Health check performed. Status: ${isHealthy ? 'OK'.green : 'ERROR'.red}`);

    return res.status(statusCode).json({
        success: isHealthy,
        status: healthStatus
    });
}

module.exports = {checkHealth};