import {AuthorizationError} from '@models';
import {verifyToken} from '@utils';
import {IUseCase, UseCaseBase} from './UseCaseBase';


type AccessCheckParamsType = {
    token: string
}

export class AccessCheck extends UseCaseBase implements IUseCase {
    static validationRules = {
        token: ['string'],
    };

    async execute(params: AccessCheckParamsType): Promise<any> {
        const token = (params.token || '').replace('Bearer ', '');
        if (!token) {
            throw new AuthorizationError('Invalid token');
        }
        await verifyToken(token);
        return null;
    }
}
