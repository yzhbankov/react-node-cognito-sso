import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID || '';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN || '';
const ISSUER = process.env.COGNITO_ISSUER || '';
const REDIRECT_URI = process.env.REDIRECT_URI || '';
const LOGOUT_URI = process.env.LOGOUT_URI || '';
const STATE_SECRET = 'secure-random-state-secret';
const TOKEN_ENDPOINT = `https://${COGNITO_DOMAIN}/oauth2/token`;
const JWKS_URL = `${ISSUER}/.well-known/jwks.json`;

export default {
    SERVER_PORT,
    CLIENT_ID,
    CLIENT_SECRET,
    COGNITO_DOMAIN,
    REDIRECT_URI,
    LOGOUT_URI,
    STATE_SECRET,
    TOKEN_ENDPOINT,
    ISSUER,
    JWKS_URL
}
