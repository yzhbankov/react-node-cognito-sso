import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SAML_ENTRY_POINT = process.env.SAML_ENTRY_POINT || '';
const SAML_ISSUER = process.env.SAML_ISSUER || '';
const SAML_CALLBACK_URL = process.env.SAML_CALLBACK_URL || '';
const SAML_CERT_PATH = process.env.SAML_CERT_PATH || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your_session_secret';
const LOGOUT_REDIRECT_URL = process.env.LOGOUT_REDIRECT_URL || 'http://localhost:8080';
const REDIRECT_AFTER_LOGIN_URL = process.env.REDIRECT_AFTER_LOGIN_URL || '/';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';

let SAML_CERT = '';
if (SAML_CERT_PATH) {
    try {
        SAML_CERT = fs.readFileSync(SAML_CERT_PATH, 'utf-8');
    } catch (error) {
        console.error(`Failed to read SAML cert at ${SAML_CERT_PATH}:`, error);
    }
}

export const config = {
    SERVER_PORT,
    SAML_ENTRY_POINT,
    SAML_ISSUER,
    SAML_CALLBACK_URL,
    SAML_CERT,
    SESSION_SECRET,
    LOGOUT_REDIRECT_URL,
    REDIRECT_AFTER_LOGIN_URL,
    JWT_SECRET,
};
