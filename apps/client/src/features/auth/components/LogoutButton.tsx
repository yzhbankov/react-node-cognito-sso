'use client';
import {useUserAuth} from '@/features/auth/hooks';

export function LogoutButton() {
    const {logout} = useUserAuth();

    return (
        <button
            onClick={logout}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
            Logout
        </button>
    );
}
