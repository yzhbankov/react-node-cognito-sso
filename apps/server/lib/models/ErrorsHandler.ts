import {Response} from 'express';
import {IOperationalError} from './Errors/BaseError';

export class ErrorHandler {
    static handleInternalError(err: IOperationalError | Error) {
        if (err.message && err.stack) {
            console.error(`[ErrorHandler] ${err.message}, ${err.stack}`);
        } else {
            console.error(`[ErrorHandler] ${err}`);
        }
    }

    static handleRequestError(res: Response, err: IOperationalError) {
        if (!res || !err) {
            return undefined;
        }
        if (!(err as IOperationalError).isOperational) {
            ErrorHandler.handleInternalError(err);
        }
        res.status(err.httpCode || 500).json(err.userMessage);

        return undefined;
    }
}
