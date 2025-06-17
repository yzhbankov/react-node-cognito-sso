import {IUseCase, UseCaseBase} from '../UseCaseBase';


export class Login extends UseCaseBase implements IUseCase {
    async execute(): Promise<Record<string, any>> {
        return {loginUrl: ''};
    }
}
