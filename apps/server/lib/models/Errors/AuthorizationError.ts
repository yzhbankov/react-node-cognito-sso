import {ERROR_CODE, HTTP_STATUS_CODE} from '../../system/constants';
import BaseError from './BaseError';

export class AuthorizationError extends BaseError {
    constructor(error: any) {
        super(error, HTTP_STATUS_CODE.UNAUTHORIZED, ERROR_CODE.AUTHORIZATION_ERROR, true);
    }
}
