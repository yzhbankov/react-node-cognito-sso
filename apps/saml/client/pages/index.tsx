import config from '../config';

export default function LoginPage() {
    const handleLogin = () => {
        window.location.href = `${config.serverURL}/login`;
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Login</h1>
            <p>You will be redirected to Azure AD to sign in.</p>
            <button
                onClick={handleLogin}
                style={{
                    padding: '0.5rem 1rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                }}
            >
                Login with SAML (Azure AD)
            </button>
        </div>
    );
}
