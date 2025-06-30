import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        const { code, state } = router.query;

        if (code && state) {
            fetch(`http://localhost:3000/auth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`)
                .then(res => res.json())
                .then(data => {
                    sessionStorage.setItem('access_token', data.access_token);
                    router.push('/home');
                })
                .catch(err => {
                    console.error('Error exchanging code:', err);
                });
        }
    }, [router.query]);

    const handleLogin = async () => {
        try {
            const res = await fetch('http://localhost:3000/auth/login');
            const data = await res.json();
            if (data.loginUrl) {
                window.location.href = data.loginUrl;
            } else {
                console.error('Login URL not found in response');
            }
        } catch (error) {
            console.error('Error fetching login URL:', error);
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <h1>Login Page</h1>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
