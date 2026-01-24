'use client';
import { useState, useEffect } from 'react';
import { socket } from './socketContext';
import Chat from '@/components/Chat';
import Login from '@/components/Login';
import { BASE_URL } from '@/api'; // your backend base URL


export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Validate token and restore user
  useEffect(() => {
    const validateUser = async () => {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!savedUser || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/validate-token`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.valid) {
          setUser(JSON.parse(savedUser));
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        console.error('Token validation failed:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, []);

  // ✅ Manage socket connection after user is authenticated
  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit('join', user.id);

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin" />
          <p className="mt-4 text-sm text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ Render UI
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {user ? (
        <>
          <Chat user={user} socket={socket} setUser={setUser} />
          {/* <OfflineMap /> */}
          {/* <Map />  */}
        </>
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
