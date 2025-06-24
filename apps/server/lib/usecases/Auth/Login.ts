import { v4 as uuidv4 } from 'uuid';
import * as ConfigContainer from '../../config';
import querystring from 'querystring';
import {IUseCase, UseCaseBase} from '../UseCaseBase';


export class Login extends UseCaseBase implements IUseCase {
    async execute(): Promise<Record<string, any>> {
        const state = uuidv4();

        const params = {
            client_id: ConfigContainer.config.aws.clientId,
            client_secret: ConfigContainer.config.aws.clientSecret,
            redirect_uri: ConfigContainer.config.aws.redirectUri,
            response_type: 'code',
            scope: 'openid email',
            state,
        };
        const queryString = querystring.stringify(params);

        return {
            loginUrl: `${ConfigContainer.config.aws.domain}/oauth2/authorize?${queryString}`,
        };
    }
}
