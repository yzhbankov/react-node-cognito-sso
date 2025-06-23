'use client';
import {LogoutButton} from '@/features/auth/components';

export default function NotAuthorized() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
            Access not authorized. Ask your administrator to set up your access.
            <LogoutButton />
        </div>
    );
}
