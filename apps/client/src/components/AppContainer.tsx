'use client';
import React from 'react';
import {AuthContextProps, useAuth} from 'react-oidc-context';

type AppContainerProps = {
    children: React.ReactNode
}

export default function AppContainer({ children }: AppContainerProps) {
    const auth: AuthContextProps = useAuth();

    if (!auth || !auth.isAuthenticated) {
        return <>{children}</>
    }
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1">
                <div className="flex-shrink-0">
                </div>
                <div className="flex flex-col flex-1">
                    <main className="flex-1 bg-gray-50 text-black">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
