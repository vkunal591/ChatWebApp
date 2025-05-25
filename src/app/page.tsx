'use client';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from '../components/Login';
import Chat from '../components/Chat';
import { BASE_URL } from '@/api';

const socket = io(`${BASE_URL}`);
export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token: any = localStorage.getItem('token');
    if (token) {
      fetch(`${BASE_URL}/api/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          setUser({ token, friends: data });
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {user ? <Chat user={user} socket={socket} setUser={setUser} /> : <Login setUser={setUser} />}
    </div>
  );
}