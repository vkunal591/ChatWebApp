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
      {/*fetch(`${BASE_URL}/api/${isRegister ? 'register' : 'login'}` */}
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
  {  /*  if (isRegister) {
        setIsRegister(false);
        setError('Registration successful! Please log in.');
      }*/}
     
        localStorage.setItem('token', data.token);
        setUser({ ...data.user, token: data.token });
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#c9d27b]">
      {/* Left Login/Register Box */}
      <div className="flex justify-center items-center w-1/2">
        <div className="bg-[#e5ebba] p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#2f2f1a]">
            Welcome Back
            {/* {isRegister ? 'Create Account' : 'Welcome Back'} */}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
            />
            <button
              type="submit"
              className="w-full bg-[#8fa325] text-white font-semibold py-2 rounded hover:bg-[#7b9021] transition-all"
            >
              Login
              {/* {isRegister ? 'Register' : 'Login'} */}
            </button>
          </form>

          {error && <p className="text-blue-500 text-sm mt-2 text-center">{error}</p>}

         {/* <div className="mt-4 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#6a7a15] hover:underline font-medium"
            >
              {isRegister
                ? 'Already have an account? Login'
                : 'Need an account? Register'}
             
            </button>
          </div>*/}
        </div>
      </div>

      {/* Right Description Section */}
      <div className="flex flex-col justify-center items-center w-1/2 px-12 text-[#2f2f1a]">
        <h1 className="text-3xl font-bold mb-4">LocalConnect</h1>
        <p className="text-lg mb-6 text-center max-w-md">
          The secure way to chat and share files on your local network
        </p>
        <ul className="space-y-3 text-left">
          <li>✅ <strong>End-to-End Encryption:</strong> Your messages stay private and secure</li>
          <li>⚡ <strong>Fast File Transfers:</strong> Share files directly on your local network</li>
          <li>📶 <strong>Offline Messaging:</strong> Works even without an internet connection</li>
        </ul>
      </div>
    </div>
  );
}
