const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');
const colors = require('colors');

const measurePromise = async (promise) => {
    const startTime = Date.now();
    try {
        await promise;
        return { status: 'ok', duration: Date.now() - startTime };
    } catch (error) {
        return { status: 'error', duration: Date.now() - startTime, message: error.message };
    }
};

const checkHealth = async (req, res) => {
    const services = {};

    const dbCheck = await measurePromise(mongoose.connection.db.admin().ping());
    services.database = {
        status: dbCheck.status === 'ok' ? 'ok' : 'down',
        message: dbCheck.status === 'ok' ? 'MongoDB is connected.' : dbCheck.message,
        responseTime: dbCheck.duration,
    };

    const cloudinaryCheck = await measurePromise(cloudinary.api.ping());
    services.cloudinary = {
        status: cloudinaryCheck.status === 'ok' ? 'ok' : 'down',
        message: cloudinaryCheck.status === 'ok' ? 'Cloudinary is connected.' : cloudinaryCheck.message,
        responseTime: cloudinaryCheck.duration,
    };

    const isHealthy = Object.values(services).every(service => service.status === 'ok');
    const overallStatus = {
        status: isHealthy ? 'ok' : 'error',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    };

    const statusCode = isHealthy ? 200 : 503;

    console.log(`Health check performed. Status: ${isHealthy ? 'OK'.green : 'ERROR'.red}`);
    
    return res.status(statusCode).json({
        success: isHealthy,
        overall: overallStatus,
        services: services
    });
};

module.exports = { checkHealth };
