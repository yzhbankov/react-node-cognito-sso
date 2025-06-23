import {useAuth} from 'react-oidc-context';

type UseUserAuth = {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => void;
}

export function useUserAuth(): UseUserAuth {
    const auth = useAuth();

    const logout = () => {
        void auth.signoutRedirect({
            extraQueryParams: {
                response_type: 'code'
            },
        });
    };

    const login = async () => {
        await auth.signinRedirect();
    };

    return {
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        login,
        logout,
    };
}
