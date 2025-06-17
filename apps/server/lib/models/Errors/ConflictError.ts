import {ERROR_CODE, HTTP_STATUS_CODE} from '../../system/constants';
import BaseError from './BaseError';

export class ConflictError extends BaseError {
    constructor(error: any) {
        super(error, HTTP_STATUS_CODE.CONFLICT, ERROR_CODE.CONFLICT, true);
    }
}
