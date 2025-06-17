import {IUseCase, UseCaseBase} from '../UseCaseBase';


export class RefreshToken extends UseCaseBase implements IUseCase {
    static validationRules = {
        refreshToken: ['strict_string'],
    };

    async execute(): Promise<Record<string, any>> {
        return {refresh_token: '', access_token: ''};
    }
}
