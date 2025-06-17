export interface IOperationalError extends Error {
    httpCode: number;
    errorCode: string;
    isOperational: boolean;
    code: string;
    userMessage: {
        message: string;
        code: string;
    };
}

export default class BaseError extends Error implements IOperationalError {
    public httpCode: number;
    public errorCode: string;
    public isOperational: boolean;

    constructor(message: string, httpCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', isOperational = false) {
        super(message);

        Error.captureStackTrace(this);
        this.httpCode = httpCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;
    }

    get code() {
        return this.errorCode;
    }

    get userMessage() {
        return {
            message: this.message,
            code: this.errorCode || '',
        };
    }
}
