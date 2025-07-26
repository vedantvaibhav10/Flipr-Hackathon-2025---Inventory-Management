const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token provided."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized, user not found."
            });
        }

        next();
    }
    catch (error) {
        console.error(`Error in auth middleware: ${error.message}`.red);
        return res.status(401).json({
            success: false,
            message: "Not authorized, token failed."
        });
    }
}

module.exports = protect;