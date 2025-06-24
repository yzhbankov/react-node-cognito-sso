interface IConfig {
    serverURL: string;
    baseURL: string;
    cognitoAuthority: string;
    cognitoClientId: string;
}

export const config: IConfig = {
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
    cognitoAuthority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY || '',
    cognitoClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
};
