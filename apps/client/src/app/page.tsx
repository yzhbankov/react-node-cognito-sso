'use client';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {routes} from '@/config';
import {useUserAuth} from '@/features/auth/hooks';

export default function HomePage() {
    const { isAuthenticated, isLoading, userEmail } = useUserAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(routes.auth.login);
        } else {
            router.push(routes.home);
        }
    }, [isLoading, isAuthenticated, router, userEmail]);

    return null;
}
