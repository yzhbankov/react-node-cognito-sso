import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';
import {AuthorizationError} from '@models';
import * as ConfigContainer from '../config';

const TTL_MILLISECONDS = ConfigContainer.config.aws.cognitoCacheTtl * 60 * 1000;
const COGNITO_SIGN_IN_URL = ConfigContainer.config.aws.cognitoTokenSigningUrl;
const COGNITO_ISSUER = (COGNITO_SIGN_IN_URL || '').replace('/.well-known/jwks.json', '');


type CacheType = {
    keys?: { [key: string]: Record<string, any> };
    updatedAt?: string;
};
const cache: CacheType = {};

function invalidateCache(cache: CacheType): void {
    if (!cache.keys || !cache.updatedAt) {
        // Clean up in case one of the props exist
        delete cache.keys;
        delete cache.updatedAt;
        return;
    }

    const now = new Date().getTime();
    const updatedTime = new Date(cache.updatedAt).getTime();
    if (now - updatedTime > TTL_MILLISECONDS) {
        delete cache.keys;
        delete cache.updatedAt;
    }
}

async function getPublicKeys(): Promise<Record<string, any>> {
    invalidateCache(cache);
    if (!cache.keys) {
        try {
            const response = await axios.get(COGNITO_SIGN_IN_URL);
            cache.keys = response.data.keys.reduce((memo: Record<string, any>, key: Record<string, any>) => {
                memo[key.kid] = key;
                return memo;
            }, {});
            cache.updatedAt = new Date().toISOString();
        } catch (error) {
            console.error('Failed to fetch AWS Cognito public keys:', error);
            throw new Error('Unable to fetch public keys');
        }
    }
    return cache.keys!;
}

export async function verifyToken(token: string) {
    try {
        const keys = await getPublicKeys();
        const decodedToken = jwt.decode(token, {complete: true});

        if (!decodedToken || !decodedToken.header.kid) {
            throw new AuthorizationError('Invalid token');
        }

        const key = keys[decodedToken.header.kid];
        if (!key) {
            throw new AuthorizationError('Invalid token');
        }

        const publicKey = jwkToPem(key);

        return jwt.verify(token, publicKey, {
            issuer: COGNITO_ISSUER,
            algorithms: ['RS256'],
        });
    } catch (error: any) {
        console.error('Token verification failed:', error?.message);
        throw new AuthorizationError('Unauthorized');
    }
}
