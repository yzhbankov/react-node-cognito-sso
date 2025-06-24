'use client';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {routes} from '@/config';
import {useUserAuth} from '@/features/auth/hooks';

type AuthGuardProps = {
    children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const {isLoading, isAuthenticated} = useUserAuth();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push(routes.login);
            }
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading && !isAuthenticated) return null;

    return children;
}
