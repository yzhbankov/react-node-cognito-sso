import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import config from '../config';

export default function HomePage() {
    const [token, setToken] = useState<string | null>(null);
    const [resourceData, setResourceData] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken) {
            router.push('/');
        } else {
            setToken(accessToken);
            fetchResource(accessToken);
        }
    }, [router]);

    const fetchResource = async (accessToken: string) => {
        try {
            const res = await fetch(`${config.serverURL}/api/resource`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setResourceData(JSON.stringify(data));
            } else {
                console.error('Failed to fetch resource');
            }
        } catch (err) {
            console.error('Error fetching resource:', err);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`${config.serverURL}/auth/logout`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const { logoutUrl } = await res.json();
                sessionStorage.removeItem('access_token');
                window.location.href = logoutUrl; // redirect to the logout URL
            } else {
                console.error('Logout request failed');
            }
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <h1>Home Page</h1>
            <p><strong>Access Token:</strong> {token}</p>
            <p><strong>Resource Data:</strong> {resourceData}</p>
            <button onClick={handleLogout} style={{ marginTop: 20 }}>
                Logout
            </button>
        </div>
    );
}
