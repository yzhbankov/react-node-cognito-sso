import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import qs from 'querystring';
import dotenv from 'dotenv';
import {checkAccess} from './middlewares/checkAccess';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID || '';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN || '';
const REDIRECT_URI = 'http://localhost:8080/';
const LOGOUT_URI = 'http://localhost:8080/';
const STATE_SECRET = 'secure-random-state-secret'; // should be random per session
const TOKEN_ENDPOINT = `https://${COGNITO_DOMAIN}/oauth2/token`;

app.get('/auth/login', (req: Request, res: Response) => {
    const state = STATE_SECRET;
    const loginUrl = `https://${COGNITO_DOMAIN}/oauth2/authorize?` + qs.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'openid profile email',
        state,
    });
    res.json({ loginUrl });
});

app.get('/auth/callback', async (req: Request, res: Response) => {
    const { code, state } = req.query;
    console.log('code, state ', code, state);

    if (state !== STATE_SECRET) {
        return res.status(400).send('Invalid state');
    }

    try {
        const response = await axios.post(
            TOKEN_ENDPOINT,
            qs.stringify({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: 'Token exchange failed', details: error.response?.data });
    }
});

app.post('/auth/refresh', async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    try {
        const response = await axios.post(
            TOKEN_ENDPOINT,
            qs.stringify({
                grant_type: 'refresh_token',
                refresh_token,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: 'Token refresh failed', details: error.response?.data });
    }
});

app.get('/auth/logout', (req: Request, res: Response) => {
    const logoutUrl = `https://${COGNITO_DOMAIN}/logout?` + qs.stringify({
        client_id: CLIENT_ID,
        logout_uri: LOGOUT_URI,
    });
    res.json({ logoutUrl });
});

app.get('/api/resource', checkAccess, (req, res) => {
    res.json({ msg: "Resource data" })
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
