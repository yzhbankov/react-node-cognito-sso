'use client';
import {useUserAuth} from '@/features/auth/hooks';

export default function Login() {
    const {login} = useUserAuth();

    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col justify-right gap-2">
            <button
                onClick={login}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Login
            </button>
        </div>
    </div>;
}
