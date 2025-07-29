const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const { config } = require('./config');

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

const samlStrategy = new SamlStrategy(
    {
        entryPoint: config.SAML_ENTRY_POINT,
        issuer: config.SAML_ISSUER,
        callbackUrl: config.SAML_CALLBACK_URL,
        cert: config.SAML_CERT,
        identifierFormat: null,
    },
    (profile, done) => {
        console.log('SAML profile:', profile);
        return done(null, {
            id: profile.nameID,
            email: profile.email || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            name: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        });
    }
);

passport.use(samlStrategy);
