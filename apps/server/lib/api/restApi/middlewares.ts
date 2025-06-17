import {Request, Response} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


export default {
    json: bodyParser.json({
        limit: '500mb',
        verify: (req: Request, res: Response, buf: Buffer) => {
            try {
                JSON.parse(buf.toString());
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err: any) {
                res.send({
                    status: 0,
                    error: {
                        message: 'Please verify your JSON',
                    },
                });
            }
        },
    }),

    urlencoded: bodyParser.urlencoded({extended: false}),

    cors: cors(),
};
