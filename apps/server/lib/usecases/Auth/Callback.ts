import {IUseCase, UseCaseBase} from '../UseCaseBase';


export class Callback extends UseCaseBase implements IUseCase {
    static validationRules = {
        code: ['strict_string'],
        state: ['strict_string'],
    };

    async execute(): Promise<Record<string, any>> {
        return {refresh_token: '', access_token: ''};
    }
}
