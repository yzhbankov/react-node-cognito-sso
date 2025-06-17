import {Request, Response} from 'express';
import {ErrorHandler} from '@models';
import {IUseCase} from '@usecases';

export type MapToParamsType = (params: any) => Record<string, any>;
export type MapToResponse = (result: Record<string, any>, res: Response, req: Request) => void;
export type RequestHandlerType = (req: Request, res: Response) => Promise<void>;

export async function runUseCase(UseCase: new () => IUseCase, {params}: { params: any }) {
    return new UseCase().run(params);
}

export function makeRequestHandler(
    UseCase: new () => IUseCase,
    mapToParams: MapToParamsType,
    mapToResponse: MapToResponse,
): RequestHandlerType {
    return async function routerHandler(req: Request, res: Response): Promise<void> {
        try {
            const params = mapToParams(req);
            const result = await runUseCase(UseCase, {params});

            if (mapToResponse) {
                mapToResponse(result, res, req);
            } else {
                res.json(result);
            }
        } catch (err: any) {
            ErrorHandler.handleRequestError(res, err);
        }
    };
}
