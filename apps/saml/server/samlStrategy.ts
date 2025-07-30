import passport from 'passport';
import { Strategy as SamlStrategy, SamlConfig, Profile } from 'passport-saml';
import { config } from './config';

type UserProfile = {
    id: string;
    email?: string;
    name?: string;
};

passport.serializeUser((user: Express.User, done) => {
    done(null, user);
});
passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
});

const samlOptions: SamlConfig = {
    entryPoint: config.SAML_ENTRY_POINT,
    issuer: config.SAML_ISSUER,
    callbackUrl: config.SAML_CALLBACK_URL,
    cert: config.SAML_CERT,
    identifierFormat: null,
};

const samlStrategy = new SamlStrategy(samlOptions, (profile: Profile, done) => {
    const user: UserProfile = {
        id: profile.nameID || '',
        email: profile.email || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] as string,
        name: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] as string,
    };
    return done(null, user);
});

passport.use(samlStrategy);
