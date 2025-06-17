import {ERROR_CODE, HTTP_STATUS_CODE} from '../../system/constants';
import BaseError from './BaseError';

export class ValidationError extends BaseError {
    constructor(error: any) {
        super(error, HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY, ERROR_CODE.VALIDATION_ERROR, true);
    }
}
