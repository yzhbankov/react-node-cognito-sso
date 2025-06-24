import React from 'react';
import AppContainer from '@/components/AppContainer';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AppContainer>{children}</AppContainer>
            </body>
        </html>
    );
}
