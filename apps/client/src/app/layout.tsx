import React from 'react';
import {ErrorBoundaryComponent} from '@/components/ErrorFallback';
import {AuthProviderWrapper} from '@/providers/auth-provider';
import AppContainer from '@/components/AppContainer';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AuthProviderWrapper>
                    <ErrorBoundaryComponent>
                        <AppContainer>{children}</AppContainer>
                    </ErrorBoundaryComponent>
                </AuthProviderWrapper>
            </body>
        </html>
    );
}
