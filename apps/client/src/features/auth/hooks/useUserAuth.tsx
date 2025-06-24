import {config} from '@/config/config';

type UseUserAuth = {
    callback: (code: string) => Promise<void>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
};

export function useUserAuth(): UseUserAuth {
    const login = async () => {
        try {
            const response = await fetch(`${config.serverURL}/api/v1/auth/log_in`);
            if (!response.ok) throw new Error('Failed to get login URL');
            const data = await response.json();
            window.location.href = data.loginUrl;
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`${config.serverURL}/auth/log_out`);
            if (!response.ok) throw new Error('Failed to get logout URL');
            const data = await response.json();
            window.location.href = data.logoutUrl;
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const callback = async (code: string) => {
        try {
            const response = await fetch(`${config.serverURL}/api/v1/auth/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                throw new Error('Failed to process callback');
            }

            const data = await response.json();
            // You can handle tokens or redirect logic here if needed
            console.log('Callback success:', data);
            window.location.href = '/';
        } catch (err) {
            console.error('Callback failed:', err);
        }
    };

    return {
        callback,
        login,
        logout,
    };
}
