'use client';
import {useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {useUserAuth} from '@/features/auth/hooks';

export default function Callback() {
    const {callback} = useUserAuth();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        if (code) {
            console.log('Code from query:', code);
            callback(code);
        }
    }, [code]);

    return Callback;
}
