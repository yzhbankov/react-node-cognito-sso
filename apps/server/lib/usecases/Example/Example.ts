import {IUseCase, UseCaseBase} from '../UseCaseBase';


export class Example extends UseCaseBase implements IUseCase {
    async execute(): Promise<Record<string, any>> {
        return {};
    }
}
