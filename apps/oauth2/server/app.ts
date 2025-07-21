import express, {Request, Response} from 'express';
import cors from 'cors';
import axios from 'axios';
import qs from 'querystring';
import config from './config';
import {checkAccess} from './middlewares';


const app = express();

app.use(express.json());
app.use(cors());

app.get('/auth/login', (req: Request, res: Response): void => {
    const state = config.STATE_SECRET;
    const loginUrl = `https://${config.COGNITO_DOMAIN}/oauth2/authorize?` + qs.stringify({
        response_type: 'code',
        client_id: config.CLIENT_ID,
        redirect_uri: config.REDIRECT_URI,
        scope: 'openid profile email',
        state,
    });
    res.json({ loginUrl });
});

app.get('/auth/callback', async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (!code || !state || state !== config.STATE_SECRET) {
        res.status(400).send('Invalid code or state');
    }

    try {
        const response = await axios.post(
            config.TOKEN_ENDPOINT,
            qs.stringify({
                grant_type: 'authorization_code',
                code,
                redirect_uri: config.REDIRECT_URI,
                client_id: config.CLIENT_ID,
                client_secret: config.CLIENT_SECRET,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: 'Token exchange failed', details: error.response?.data });
    }
});

app.post('/auth/refresh', async (req: Request, res: Response): Promise<void> => {
    const { refresh_token } = req.body;

    try {
        const response = await axios.post(
            config.TOKEN_ENDPOINT,
            qs.stringify({
                grant_type: 'refresh_token',
                refresh_token,
                client_id: config.CLIENT_ID,
                client_secret: config.CLIENT_SECRET,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: 'Token refresh failed', details: error.response?.data });
    }
});

app.get('/auth/logout', (req: Request, res: Response): void => {
    const logoutUrl = `https://${config.COGNITO_DOMAIN}/logout?` + qs.stringify({
        client_id: config.CLIENT_ID,
        logout_uri: config.LOGOUT_URI,
    });
    res.json({ logoutUrl });
});

app.get('/api/resource', checkAccess, (req, res): void => {
    res.json({ msg: "Resource data", ts: new Date().toISOString() });
});

app.listen(config.SERVER_PORT, () => console.log(`Server running on port ${config.SERVER_PORT}`));
