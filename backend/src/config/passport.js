const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user.model');

const GOOGLE_CALLBACK_URL = "https://inventory-management-backend-gmik.onrender.com/api/v1/auth/google/callback";
const GITHUB_CALLBACK_URL = "https://inventory-management-backend-gmik.onrender.com/api/v1/auth/github/callback";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    proxy: true 
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) return done(null, user);
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                user.googleId = profile.id;
                await user.save();
                return done(null, user);
            }
            const newUser = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                isVerified: true,
            });
            done(null, newUser);
        } catch (error) {
            done(error, false);
        }
    }));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL,
    scope: ['user:email'],
    proxy: true 
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ githubId: profile.id });
            if (user) return done(null, user);
            const email = profile.emails && profile.emails[0].value;
            if (email) {
                user = await User.findOne({ email });
                if (user) {
                    user.githubId = profile.id;
                    await user.save();
                    return done(null, user);
                }
            }
            const newUser = await User.create({
                githubId: profile.id,
                name: profile.displayName || profile.username,
                email: email,
                isVerified: true,
            });
            done(null, newUser);
        } catch (error) {
            done(error, false);
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});
