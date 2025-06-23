interface IConfig {
    serverURL: string;
}

export const config: IConfig = {
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
};
