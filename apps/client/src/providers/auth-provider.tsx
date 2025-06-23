'use client';
import { AuthProvider } from 'react-oidc-context';
import {config} from '@/config';

const cognitoAuthConfig = {
    authority: config.cognitoAuthority,
    client_id: config.cognitoClientId,
    redirect_uri: config.baseURL,
    post_logout_redirect_uri: config.baseURL,
    response_type: 'code',
    scope: 'openid email phone profile',
};

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
