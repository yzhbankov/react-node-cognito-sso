const cors = require('cors');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('./samlStrategy');
require('dotenv').config();

const app = express();
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your_session_secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // true if HTTPS
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:8080', // allow your React frontend
    credentials: true,              // allow cookies (auth_token) to be sent
}));

// Login route
app.get('/login', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }));

app.get('/logout', (req, res) => {
    req.logout(() => {
        // Clear cookie and destroy session
        res.clearCookie('auth_token');
        req.session.destroy(() => {
            res.redirect(process.env.LOGOUT_REDIRECT_URL || 'http://localhost:8080');
        });
    });
});


// Callback route
app.post(
    '/auth/callback',
    passport.authenticate('saml', { failureRedirect: '/' }),
    (req, res) => {
        console.log('SAML login succeeded, user:', req.user);
        const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('auth_token', token, { httpOnly: true });
        res.redirect(process.env.REDIRECT_AFTER_LOGIN_URL || '/');
    }
);

// Protected route
app.get('/api/protected', (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ message: 'Protected content', user });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${process.env.SERVER_PORT}`);
});
