import express, { Request, Response, NextFunction } from 'express';
import { Strategy as SamlStrategy } from 'passport-saml';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import { config } from './config';

const app = express();

// Session middleware for classic SAML session handling
app.use(session({
    secret: 'your-session-secret234kjfmnbHJK234',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true in production with HTTPS
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new SamlStrategy({
    debug: true,
    entryPoint: config.SAML_ENTRY_POINT,
    issuer: config.SAML_ISSUER,
    callbackUrl: config.SAML_CALLBACK_URL,
    cert: config.SAML_CERT,
    logoutUrl: config.SAML_LOGOUT_URL,
}, (profile, done) => {
    return done(null, profile);
}));

// Store only user identifier in session
passport.serializeUser((user: any, done) => {
    done(null, user.nameID || user.email || user.id || user);
});

// Retrieve full user object (optional)
passport.deserializeUser((id, done) => {
    done(null, id);
});

// Route: Start SAML login flow
app.get('/auth/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('saml')(req, res, next);
});

// Route: Handle SAML callback after IdP authentication
app.post('/auth/callback',
    passport.authenticate('saml', { failureRedirect: '/auth/login', failureFlash: true }),
    (req: Request, res: Response) => {
        // Successful authentication
        res.redirect('/dashboard'); // or wherever you want to go
    }
);

// Route: Logout user and initiate SAML logout with IdP
app.get('/auth/logout', (req: Request, res: Response) => {
    const samlStrategy = passport._strategy('saml');
    const user = req.user as any;

    if (!user || !user.nameID || !user.sessionIndex) {
        return res.redirect('/');
    }

    samlStrategy.logout(req, (err: Error | null, requestUrl: string) => {
        if (err) {
            console.error('SAML logout error:', err);
            return res.status(500).send('Logout failed');
        }

        req.logout(() => {
            res.redirect(requestUrl);
        });
    });
});

// Route: Handle logout callback from IdP
app.post('/auth/logout/callback', (req: Request, res: Response) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// Protected route example
app.get('/dashboard', (req: Request, res: Response) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).send('Unauthorized');
    }

    res.send(`<h1>Welcome ${req.user}</h1><p><a href="/auth/logout">Logout</a></p>`);
});

// Home route
app.get('/', (req: Request, res: Response) => {
    res.send(`<h1>Home</h1><p><a href="/auth/login">Login with SAML</a></p>`);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SAML server listening on port ${PORT}`);
});
