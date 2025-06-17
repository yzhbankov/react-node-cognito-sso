import LIVR, {Validator} from 'livr';
import {ValidationError} from '@models';


export interface IUseCase {
    validator: typeof Validator<any> | null;
    run: (params: any) => Promise<any>;
    validate: (params: Record<string, any>) => Promise<Record<string, any>>;
    execute: (params: any) => Promise<any>;
}

export class UseCaseBase implements IUseCase {
    public validator: any;

    static validationRules: any = {}; // Define default validation rules

    constructor() {
        this.validator = null;
    }

    async run(params: any): Promise<any> {
        const cleanParams = await this.validate(params);
        return this.execute(cleanParams);
    }

    async validate(params: Record<string, any>): Promise<Record<string, any>> {
        const rules = (this.constructor as typeof UseCaseBase).validationRules;
        this.validator = new LIVR.Validator(rules);

        const validatedData = this.validator.validate(params);

        if (!validatedData) {
            const errors = this.validator.getErrors();
            throw new ValidationError(JSON.stringify(errors));
        }

        return validatedData;
    }

    async execute(params: any): Promise<any> {
        return params;
    }
}
