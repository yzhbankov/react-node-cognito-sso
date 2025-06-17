import {NextFunction, Request, Response} from 'express';
import {ErrorHandler} from '@models';
import {runUseCase} from '@utils/api';
import {AccessCheck} from '@usecases';

export default {
    async check(req: Request, res: Response, next: NextFunction) {
        const promise = runUseCase(AccessCheck, {
            params: {
                token: req.headers?.authorization || '',
            },
        });
        try {
            await promise;
            return next();
        } catch (err: any) {
            ErrorHandler.handleRequestError(res, err);
        }
    },
};
