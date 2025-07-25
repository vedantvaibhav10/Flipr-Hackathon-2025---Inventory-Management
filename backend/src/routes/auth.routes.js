const express = require('express');
const { registerUser, verifyOtp, loginUser, logoutUser, getMe } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);

module.exports = router;