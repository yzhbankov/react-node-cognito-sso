import { useEffect, useState } from 'react';
import config from '../config';

export default function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`${config.serverURL}/api/protected`, { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
            })
            .then(data => setUser(data.user))
            .catch((err) => {
                console.error(err);
                window.location.href = `${config.serverURL}/login`;
            });
    }, []);

    const handleLogout = () => {
        window.location.href = `${config.serverURL}/logout`;
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Welcome, {user.name || user.email}</h1>
            <p>You are authenticated!</p>
            <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
                Logout
            </button>
        </div>
    );
}
