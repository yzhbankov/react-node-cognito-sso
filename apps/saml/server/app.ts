import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import middlewares from './middlewares';
import { config } from './config';
import './samlStrategy';

const app = express();

app.use(middlewares.cookieParser());
app.use(middlewares.session());
app.use(middlewares.passportInit());
app.use(middlewares.passportSession());
app.use(middlewares.urlencode());
app.use(middlewares.cors());

app.get('/api/auth/login', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }));

app.get('/api/auth/logout', (req, res) => {
    req.logout(() => {
        res.clearCookie('auth_token');
        req.session.destroy(() => {
            res.redirect(config.LOGOUT_REDIRECT_URL);
        });
    });
});

app.post('/api/auth/callback', passport.authenticate('saml', { failureRedirect: '/' }),
    (req, res) => {
        const token = jwt.sign(req.user, config.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('auth_token', token, { httpOnly: true });
        res.redirect(config.REDIRECT_AFTER_LOGIN_URL);
    }
);

app.get('/api/protected', (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const user = jwt.verify(token, config.JWT_SECRET);
        res.json({ message: 'Protected content', user });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.listen(config.SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${config.SERVER_PORT}`);
});
