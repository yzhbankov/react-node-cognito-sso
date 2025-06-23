import {config} from '@/config';
import {getQueryParam} from '@/utils/utils';

type FetchOptions<T = any> = {
    token?: string;
    body?: T;
    headers?: HeadersInit;
};

const request = async <T = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    uri: string,
    { token, body, headers: customHeaders }: FetchOptions = {}
): Promise<T> => {
    const headers: HeadersInit = {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    const query = getQueryParam('target_server');
    const res = await fetch(`${config.serverURL}${uri}${query ? `?target_server=${query}` : ''}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        if(res.status === 413) {
            const info = 'Content Too Large';
            const error = new Error(info);
            (error as any).info = {message: info};
            (error as any).status = res.status;
            throw error;
        }
        let info;
        try {
            info = await res.json();
        } catch (err) {
            info = {message: await res.text()};
        }

        const error = new Error('An error occurred while fetching the data.');
        (error as any).info = info;  // TODO integrate info to Error type {info:{message:'text'}}
        (error as any).status = res.status;

        throw error;
    }

    return res.json();
};

export const api = {
    get: <T = unknown>(uri: string, options?: FetchOptions) =>
        request<T>('GET', uri, options),

    post: <T = unknown>(uri: string, options?: FetchOptions) =>
        request<T>('POST', uri, options),

    put: <T = unknown>(uri: string, options?: FetchOptions) =>
        request<T>('PUT', uri, options),

    del: <T = unknown>(uri: string, options?: FetchOptions) =>
        request<T>('DELETE', uri, options),

    patch: <T = unknown>(uri: string, options?: FetchOptions) =>
        request<T>('PATCH', uri, options),
};
