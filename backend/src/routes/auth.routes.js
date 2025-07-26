const express = require('express');
const { registerUser, verifyOtp, loginUser, logoutUser, getMe } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');
const router = express.Router();
const passport = require('passport');
const { oauthCallback } = require('../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), oauthCallback);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }), oauthCallback);


module.exports = router;