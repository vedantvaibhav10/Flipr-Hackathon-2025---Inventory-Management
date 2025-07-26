const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user.model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://inventory-management-backend-j0w6.onrender.com/api/v1/auth/google/callback",
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
    callbackURL: "https://inventory-management-backend-j0w6.onrender.com/api/v1/auth/github/callback",
    scope: ['user:email']
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
