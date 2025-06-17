import * as fs from 'fs';
import LIVR from 'livr';

function replace(template: any, vars: any) {
    return template.replace(/\{\{(.+?)\}\}/g, (match: any, p1: any) => {
        // eslint-disable-next-line no-prototype-builtins
        if (vars.hasOwnProperty(p1)) {
            return vars[p1];
        }
        throw new Error(`Variable "${p1}" not set!`);
    });
}

function validateConfig(config: any, livrSchemaPath: string) {
    const livrRules = JSON.parse(fs.readFileSync(livrSchemaPath).toString());
    const validator = new LIVR.Validator(livrRules);

    const validConfig = validator.validate(config);

    if (!validConfig) {
        const error = {
            FAILED_CONFIG: config,
            ERRORS: validator.getErrors(),
        };
        throw new Error(JSON.stringify(error, null, 2));
    }

    return validConfig;
}

export type ConfigType = {
    serverPort: number;
    aws: {
        cognitoTokenSigningUrl: string;
        cognitoCacheTtl: number;
    };
};

export default function confme(configPath: string, livrSchemaPath: string): ConfigType {
    const template = fs.readFileSync(configPath).toString();
    const configStr = replace(template, process.env);

    let config = {};

    try {
        config = JSON.parse(configStr);
    } catch (error) {
        console.error('CANNOT PARSE JSON:', configStr);
        throw error;
    }

    if (livrSchemaPath) {
        config = validateConfig(config, livrSchemaPath);
    }

    return config as ConfigType;
}
