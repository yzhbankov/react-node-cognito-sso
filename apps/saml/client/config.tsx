interface IConfig {
    serverURL: string;
}

export default {
    serverURL: process.env.NEXT_PUBLIC_API_URL || ''
} as IConfig;
