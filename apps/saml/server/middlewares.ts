import cors from 'cors';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import {config} from './config';

export default {
    cors: () => cors({
        origin: 'http://localhost:8080', // allow your React frontend
        credentials: true,              // allow cookies (auth_token) to be sent
    }),
    urlencode: () => express.urlencoded({ extended: true }),
    passportSession: () => passport.session(),
    passportInit: () => passport.initialize(),
    session: () => session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // true if HTTPS
    }),
    cookieParser: () => cookieParser(),
}
