'use client'
// Home.tsx
import { useState, useEffect } from 'react';
import { socket } from './socketContext'; // Import socket from context or where defined
import Chat from '@/components/Chat';
import Login from '@/components/Login';


export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
    }
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
