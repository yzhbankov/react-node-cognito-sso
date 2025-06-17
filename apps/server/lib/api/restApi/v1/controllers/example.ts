import {Request, Response} from 'express';
import {makeRequestHandler} from '@utils/api';
import {Example} from '@usecases';

export default {
    get: makeRequestHandler(
        Example,
        (req: Request): Record<string, any> => ({}),
        (result: Record<string, any>, res: Response): void => {
            res.json(result);
        }
    ),
}
