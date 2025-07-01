import {Request, Response, NextFunction} from 'express';
import jwkToPem, {JWK as JwkToPemJwk} from 'jwk-to-pem';
import jwt, {JwtHeader} from 'jsonwebtoken';
import fetch from 'node-fetch';
import config from './config';


type CognitoJwk = JwkToPemJwk & {
    kid: string;
};

async function getPublicKeys(): Promise<Record<string, CognitoJwk>> {
    const res = await fetch(config.JWKS_URL);
    if (!res.ok) throw new Error(`Failed to fetch JWKS: ${res.status}`);
    const json = (await res.json()) as { keys: CognitoJwk[] };

    return json.keys.reduce((acc, key) => {
        acc[key.kid] = key;
        return acc;
    }, {} as Record<string, CognitoJwk>);
}

export async function verifyAwsToken(token: string): Promise<jwt.JwtPayload> {
    const decoded = jwt.decode(token, { complete: true }) as { header: JwtHeader } | null;
    if (!decoded || !decoded.header?.kid) throw new Error('Invalid token');

    const keys = await getPublicKeys();
    const jwk = keys[decoded.header.kid];
    if (!jwk) throw new Error('Invalid token');

    const pem = jwkToPem(jwk);

    const verified = jwt.verify(token, pem, {
        algorithms: ['RS256'],
        issuer: config.ISSUER,
    });

    if (typeof verified === 'string') {
        throw new Error('Unexpected token format');
    }

    return verified;
}

export const checkAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Missing or invalid Authorization header' });
            return;
        }

        const token = authHeader.split(' ')[1];

        await verifyAwsToken(token);

        next();
    } catch (err: any) {
        console.error('Token verification error:', err?.message || err);
        res.status(401).json({ error: 'Invalid token' });
    }
};

