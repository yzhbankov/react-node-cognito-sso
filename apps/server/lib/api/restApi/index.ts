import express, {Express} from 'express';
import middlewares from './middlewares';
import v1Router from './v1/router';

let server: null | ReturnType<Express['listen']> = null;
export const app = express();

app.use(middlewares.cors);
app.use(middlewares.json);
app.use(middlewares.urlencoded);

app.use('/api/v1/', v1Router);
app.get('/', (req, res) => {
    res.status(200).send({});
});

export function startServer({serverPort}: { serverPort: number }): void {
    server = app.listen(serverPort, () => {
        console.log('Server listening on port:', serverPort);
    });
}

export async function stopServer(): Promise<void> {
    if (!server) return;

    server.close();
    console.log('Server stopped');
}
