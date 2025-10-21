'use client'
// Home.tsx
import { useState, useEffect } from 'react';
import { socket } from './socketContext'; // Import socket from context or where defined
import Chat from '@/components/Chat';
import Login from '@/components/Login';


export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
    }
    setLoading(false)
  }, []);

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit('join', user.id);

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        {/* Loader Spinner */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin" />
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {user ? (
        <Chat user={user} socket={socket} setUser={setUser} />
      ) : (
        <Login
          setUser={(u: any) => {
            setUser(u);
            localStorage.setItem('user', JSON.stringify(u));
            localStorage.setItem('token', u.token);
          }}
        />
      )}
    </div>
  );
}
