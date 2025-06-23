'use client';
import {AuthContextProps, useAuth} from 'react-oidc-context';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useUserAuth} from '@/features/auth/hooks';
import {routes} from '@/config';

export default function Login() {
    const {login} = useUserAuth();
    const auth: AuthContextProps = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!auth.isLoading && auth.isAuthenticated) {
            router.push(routes.home);
        }
    }, [auth.isLoading, auth.isAuthenticated, router]);

    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col justify-right gap-2">
            <button
                onClick={login}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Login
            </button>
        </div>
    </div>;
}
