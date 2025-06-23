'use client';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {routes} from '@/config';
import {SpinningCircle} from '@/components/SpinningCircle';
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
                router.push(routes.auth.login);
            }
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading && !isAuthenticated) return <SpinningCircle size={16} global />;

    return children;
}
