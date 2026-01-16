'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/api'; // your API base URL

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/auth/validate-token`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res)
        if (!res.ok) throw new Error('Invalid token');
        const data = await res.json();

        // Adjust based on your API response
        if (data.valid || data.status === 'success') {
          setLoading(false);
        } else {
          throw new Error('Token expired or invalid');
        }
      } catch (err) {
        console.error('Auth validation failed:', err);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    validateToken();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}
