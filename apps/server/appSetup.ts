import * as RestApi from './lib/api/restApi';
import * as ConfigContainer from './lib/config';

export async function main(): Promise<void> {
    // Init Controllers Layer (API)
    RestApi.startServer({
        serverPort: ConfigContainer.config.serverPort,
    });

    // Add Global Unhandled Errors Handlers
    async function exit() {
        await RestApi.stopServer();
        console.log('Exit');
        process.exit(0);
    }

    process.on('SIGTERM', async () => {
        console.error('SIGTERM signal caught');
        await exit();
    });

    process.on('SIGINT', async () => {
        console.error('SIGINT signal caught');
        await exit();
    });

    process.on('unhandledRejection', (error: Error) => {
        console.error('unhandledRejection', error.stack);
    });

    process.on('uncaughtException', (error: Error) => {
        console.error('uncaughtException', error.stack);
    });
}
