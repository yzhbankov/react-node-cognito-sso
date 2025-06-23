'use client';
import {AuthContextProps, useAuth} from 'react-oidc-context';
import {Layout} from '@/components/Layout';
import {Header} from '@/features/header/components';
import {Navbar} from '@/features/navbar/components';
import {Footer} from '@/features/footer/components';
import React, {useEffect} from 'react';
import ReactModal from 'react-modal';
import {useUserAuth} from '@/features/auth/hooks';

type AppContainerProps = {
    children: React.ReactNode
}

export default function AppContainer({ children }: AppContainerProps) {
    const { noRole } = useUserAuth();
    const auth: AuthContextProps = useAuth();

    useEffect(() => {
        ReactModal.setAppElement('#__next'); // Safe to run only in the browser
    }, []);

    if (!auth || !auth.isAuthenticated || noRole) {
        return <>{children}</>
    }
    return (
        <Layout
            renderHeader={Header}
            renderFooter={Footer}
            renderNavbar={Navbar}
            renderContent={() => children}
        />
    )
}
