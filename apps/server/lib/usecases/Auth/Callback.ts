import * as ConfigContainer from '../../config';
import { IUseCase, UseCaseBase } from '../UseCaseBase';
import querystring from 'querystring';

export class Callback extends UseCaseBase implements IUseCase {
    static validationRules = {
        code: ['string'],
    };

    async execute({ code }: { code: string }): Promise<Record<string, any>> {
        const tokenUrl = `${ConfigContainer.config.aws.domain}/oauth2/token`;

        const data = {
            code,
            grant_type: 'authorization_code',
            client_secret: ConfigContainer.config.aws.clientSecret,
            redirect_uri: ConfigContainer.config.aws.redirectUri,
            client_id: ConfigContainer.config.aws.clientId,
        };

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: querystring.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Token request failed: ${response.status} ${errorBody}`);
        }

        return await response.json(); // this returns the access_token, id_token, etc.
    }
}
