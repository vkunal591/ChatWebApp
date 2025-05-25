import { BASE_URL } from '@/api';
import { useState } from 'react';

export default function Login({ setUser }: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${BASE_URL}/api/${isRegister ? 'register' : 'login'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            if (isRegister) {
                setIsRegister(false);
                setError('Registration successful! Please log in.');
            } else {
                localStorage.setItem('token', data.token);
                setUser({ ...data.user, token: data.token });
            }
        } catch (err: any) {
            setError(err.message);  
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    {isRegister ? 'Register' : 'Login'}
                </button>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="w-full text-blue-500 hover:underline"
                >
                    {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
                </button>
            </div>
        </div>
    );
} 