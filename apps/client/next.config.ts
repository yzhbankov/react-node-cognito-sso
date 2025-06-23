import type {NextConfig} from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
    basePath: process.env.NEXT_PUBLIC_BASE_APP_URI || '/',
    output: 'export',
    trailingSlash: !isDev,
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
