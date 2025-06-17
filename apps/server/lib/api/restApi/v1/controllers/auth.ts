import {Request, Response} from 'express';
import {makeRequestHandler} from '@utils/api';
import {Login, Callback, RefreshToken} from '@usecases';

export default {
    login: makeRequestHandler(
        Login,
        (req: Request): Record<string, any> => ({}),
        (result: Record<string, any>, res: Response): void => {
            res.json(result);
        }
    ),

    cb: makeRequestHandler(
        Callback,
        (req: Request): Record<string, any> => ({
            code: req.body.code,
            state: req.body.state,
        }),
        (result: Record<string, any>, res: Response): void => {
            res.json(result);
        }
    ),

    refresh: makeRequestHandler(
        RefreshToken,
        (req: Request): Record<string, any> => ({
            code: req.body.refresh_token,
        }),
        (result: Record<string, any>, res: Response): void => {
            res.json(result);
        }
    ),
}
