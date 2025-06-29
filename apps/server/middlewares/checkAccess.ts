import { Request, Response, NextFunction } from 'express';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const JWKS_URL = `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Ed6C3tdul/.well-known/jwks.json`;
const ISSUER = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Ed6C3tdul';

interface Jwk {
    kid: string;
    // other properties
}

async function getPublicKeys(): Promise<Record<string, Jwk>> {
    const res = await fetch(JWKS_URL);
    if (!res.ok) throw new Error(`Failed to fetch JWKS: ${res.status}`);

    const { keys }: { keys: Jwk[] } = await res.json();

    return keys.reduce((acc, key) => {
        acc[key.kid] = key;
        return acc;
    }, {} as Record<string, Jwk>);
}

export async function verifyAwsToken(token: string): Promise<any> {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header?.kid) throw new Error('Invalid token');

    const keys = await getPublicKeys();

    const jwk = keys[decoded.header.kid];
    if (!jwk) throw new Error('Invalid token');

    const pem = jwkToPem(jwk);

    return jwt.verify(token, pem, {
        algorithms: ['RS256'],
        issuer: ISSUER,
    });
}

export const checkAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid Authorization header' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = await verifyAwsToken(token);

        (req as any).user = decoded;
        next();
    } catch (err: any) {
        console.error('Token verification error:', err.message || err);
        res.status(401).json({ error: 'Invalid token' });
    }
};
