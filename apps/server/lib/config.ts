import * as path from 'path';
import * as dotenv from 'dotenv';
import confme, {ConfigType} from './confme';

function getEnvPath(env?: string): string | null {
    if (env === 'prod') {
        return path.join(__dirname, '../.env');
    }
    return path.join(__dirname, '../.env.defaults');
}

const envPath = getEnvPath(process.env.NODE_ENV);

if (envPath) {
    dotenv.config({path: envPath});
}

const ROOT_SERVER_PATH = __dirname;

const config: ConfigType = confme(
    path.join(ROOT_SERVER_PATH, '../config/config.json'),
    path.join(ROOT_SERVER_PATH, '../config/config-schema.json'),
);

export {config};
