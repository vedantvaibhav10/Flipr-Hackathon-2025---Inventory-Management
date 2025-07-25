const User = require('../models/user.model');
const Otp = require('../models/otp.model');
const sendEmail = require('../services/email.service');
const colors = require('colors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields."
            })
        }

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists."
            })
        }

        const user = await User.create({
            name,
            email,
            password
        });

        console.log(`User registered: ${user}`.blue);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.create({ email, otp });

        const emailSubject = 'Your OTP for Verification';
        const emailHtml = `<p>Your verification OTP is: <b>${otp}</b>. It is valid for 10 minutes.</p>`;
        await sendEmail(email, emailSubject, emailHtml);

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please check your email for the OTP."
        });
    }
    catch (error) {
        console.error(`Error registering user: ${error.message}`.red);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required."
            });
        }

        const otpRecord = await Otp.findOne({ email, otp });

        if( !otpRecord ) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP."
            });
        }

        const user = await User.findOneAndUpdate({email}, { isVerified: true }, { new: true });

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        await Otp.deleteOne({_id: otpRecord._id});

        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now log in.",
        });
    }
    catch (error) {
        console.error(`Error verifying OTP: ${error.message}`.red);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if(!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Email not verified. Please verify your email first."
            });
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if(!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );

        const options = {
            httpOnly: true,
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        };

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).cookie('token', token, options).json({
            success: true,
            token,
            user: userResponse,
            message: "Logged in successfully."
        })
    }
    catch(error) {
        console.error(`Error logging in user: ${error.message}`.red);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

const logoutUser = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        };

        return res.status(200).clearCookie('token', options).json({
            success: true,
            message: "Logged out successfully."
        })
    }
    catch(error) {
        console.error(`Error logging out user: ${error.message}`.red);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
};

module.exports = {
    registerUser,
    verifyOtp,
    loginUser,
    logoutUser,
    getMe
};