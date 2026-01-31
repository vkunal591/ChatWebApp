import { BASE_URL } from "@/api";
import { useState } from "react";
interface Props {
  setUser: (user: any) => void;
}

export default function Login({ setUser }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      {
        /*fetch(`${BASE_URL}/api/${isRegister ? 'register' : 'login'}` */
      }
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      {
        /*  if (isRegister) {
        setIsRegister(false);
        setError('Registration successful! Please log in.');
      }*/
      }

      setTimeout(() => {
        setLoading(false);
        localStorage.setItem("token", data.token);
        setUser({ ...data.user, token: data.token });
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    // <div className="flex h-screen w-full bg-[#c9d27b]">
    //   {/* Left Login/Register Box */}
    //   <div className="flex justify-center items-center w-1/2">
    //     <div className="bg-[#e5ebba] p-8 rounded-xl shadow-lg w-96">
    //       <h2 className="text-2xl font-semibold text-center mb-6 text-[#2f2f1a]">
    //         Welcome Back
    //         {/* {isRegister ? 'Create Account' : 'Welcome Back'} */}
    //       </h2>
    //       <form onSubmit={handleSubmit} className="space-y-4">
    //         <input
    //           type="text"
    //           placeholder="Username"
    //           value={username}
    //           onChange={(e) => setUsername(e.target.value)}
    //           className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-600 text-black"
    //         />
    //         <input
    //           type="password"
    //           placeholder="Password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-600 text-black"
    //         />
    //         <button
    //           type="submit"
    //           className="w-full bg-[#8fa325] text-white font-semibold py-2 rounded hover:bg-[#7b9021] transition-all"
    //         >
    //           Login
    //           {/* {isRegister ? 'Register' : 'Login'} */}
    //         </button>
    //       </form>

    //       {error && <p className="text-blue-500 text-sm mt-2 text-center">{error}</p>}

    //      {/* <div className="mt-4 text-center">
    //         <button
    //           onClick={() => setIsRegister(!isRegister)}
    //           className="text-[#6a7a15] hover:underline font-medium"
    //         >
    //           {isRegister
    //             ? 'Already have an account? Login'
    //             : 'Need an account? Register'}

    //         </button>
    //       </div>*/}
    //     </div>
    //   </div>

    //   {/* Right Description Section */}
    //   <div className="flex flex-col justify-center items-center w-1/2 px-12 text-[#2f2f1a]">
    //     <h1 className="text-3xl font-bold mb-4">LocalConnect</h1>
    //     <p className="text-lg mb-6 text-center max-w-md">
    //       The secure way to chat and share files on your local network
    //     </p>
    //     <ul className="space-y-3 text-left">
    //       <li>✅ <strong>End-to-End Encryption:</strong> Your messages stay private and secure</li>
    //       <li>⚡ <strong>Fast File Transfers:</strong> Share files directly on your local network</li>
    //       <li>📶 <strong>Offline Messaging:</strong> Works even without an internet connection</li>
    //     </ul>
    //   </div>
    // </div>
    <div
      className="relative h-screen w-full flex items-center justify-center overflow-hidden
      bg-gradient-to-br from-[#f5f7fa] to-[#e4e8ec]"
    >
      {/* Animated Gradient Overlay */}
      <div
        className="absolute inset-0 animate-gradientShift
        bg-[linear-gradient(-45deg,rgba(255,153,51,0.1),rgba(255,255,255,0.05),rgba(19,136,8,0.1),rgba(75,107,60,0.05),rgba(11,31,59,0.08))]"
      />

      {/* Floating Particles */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#4B6B3C]/15 animate-float"
          style={{
            width: [80, 60, 100, 40][i],
            height: [80, 60, 100, 40][i],
            left: ["10%", "80%", "50%", "30%"][i],
            top: ["20%", "60%", "80%", "40%"][i],
            animationDelay: `${i * 5}s`,
          }}
        />
      ))}

      {/* India Map */}
      <svg
        viewBox="0 0 800 800"
        className="absolute w-[700px] opacity-[0.06] animate-mapPulse"
      >
        <path
          d="M300 200 L350 250 L370 300 L400 350 L380 400 L350 450 L320 500 L300 550 L280 500 L250 450 L230 400 L260 350 L280 300 L300 200 Z"
          stroke="#0B1F3B"
          fill="none"
          strokeWidth="5"
        />
      </svg>

      {/* Network */}
      <div className="absolute top-[45%] left-[20%] w-4 h-4 rounded-full bg-gradient-to-br from-[#4B6B3C] to-[#6b8e5e] animate-nodeGlow animate-pulse-ring" />
      <div className="absolute top-[60%] left-[80%] w-3 h-3 rounded-full bg-gradient-to-br from-[#4B6B3C] to-[#6b8e5e] animate-nodeGlow animate-pulse-ring" />
      <div
        className="absolute top-[52%] left-[20%] w-[55%] h-[2px] rotate-[15deg]
        bg-gradient-to-r from-transparent via-[#4B6B3C] to-transparent animate-connection"
      />
      <div className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#4B6B3C] to-[#8fbc8f] animate-data shadow-lg" />

      {/* LOGIN BOX */}
      <div
        className="relative z-10 w-full max-w-[650px]  bg-white rounded-2xl mb-30
        shadow-[0_25px_80px_rgba(0,0,0,0.12)] flex overflow-hidden max-h-[350px]"
      >
        {/* LEFT BRAND */}
        <div
          className="hidden md:flex w-1/2 p-12 text-white text-center
          bg-gradient-to-br from-[#0B1F3B] via-[#1c355e] to-[#2a4a7c]
          relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-30 animate-bgMove
            bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)]
            bg-[length:20px_20px]"
          />

          <div className="relative z-10 m-auto">
            <img
              src="/assets/logo/localchatlogo.png"
              alt="logo"
              className="w-[80px] mx-auto mb-5 animate-logo drop-shadow-xl"
            />
            <h1 className="text-base font-bold tracking-widest">LOCAL CHAT</h1>
            <p className="text-[10px] opacity-90 mt-2">
              Secure Geo Communication Platform
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN */}
        <div className="w-full md:w-1/2 p-12">
          <h2 className="text-lg font-bold text-[#0B1F3B] relative after:block after:w-12 after:h-1 after:bg-gradient-to-r after:from-[#4B6B3C] after:to-[#0B1F3B] after:mt-0">
            User Login
          </h2>
          <p className="text-[10px] text-gray-500 mb-2">
            Secure Internal Network
          </p>

          <form onSubmit={handleSubmit}>
            <label className="text-[10px]">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=" text-[10px] w-full mb-1 p-4 h-[10px] flex items-center justify-center gap-2 
            bg-[#4B6B3C]/5 border border-[#4B6B3C]/10 rounded-lg] rounded-lg"
              placeholder="Enter Username"
              required
            />
            <label className="text-[10px]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-[10px] w-full mb-5 p-4 h-[10px] flex items-center justify-center gap-2 
            bg-[#4B6B3C]/5 border border-[#4B6B3C]/10 rounded-lg] rounded-lg"
              placeholder="Enter Password"
              required
            />

            <button
              className=" text-xs w-full  p-2 rounded-lg font-semibold text-white
              bg-gradient-to-br from-[#4B6B3C] to-[#3f5a32]
              hover:-translate-y-0.5 transition shadow-lg"
            >
              {loading ? (
                <span className=" text-[10px] flex items-center justify-center gap-2">
                  <span className="text-[10px] w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-fast" />
                  Authenticating...
                </span>
              ) : (
                "Secure Login"
              )}
            </button>
          </form>

          <div
            className="text-[10px] h-[20px] mt-6 flex items-center justify-center p-3
            bg-[#4B6B3C]/5 border border-[#4B6B3C]/10 rounded-lg text-gray-600"
          >
            <span className="text-xs animate-lock">🔒</span>
            Encrypted Session • Internal Access Only
          </div>
        </div>
      </div>

      {/* GLOBAL FOOTER */}
      <div
        className="absolute z-10 mt-90 w-full max-w-[650px]
  rounded-2xl bg-white/80 backdrop-blur-xl
  shadow-[0_10px_30px_rgba(0,0,0,0.05)]
  px-5 py-3 text-center max-h-[100px]"
      >
        {/* FOOTER LINKS */}
        <div className="mb-2 flex flex-wrap justify-center gap-2">
          <a
            href="user-manual.html"
            className="rounded-full px-4 py-2 text-[10px] font-medium text-[#0B1F3B]
      transition-all duration-300
      hover:-translate-y-0.5
      hover:bg-[#4B6B3C]/10
      hover:text-[#4B6B3C]"
          >
            📖 User Manual
          </a>

          <a
            href="privacy-policy.html"
            className="rounded-full px-4 py-2 text-[10px] font-medium text-[#0B1F3B]
      transition-all duration-300
      hover:-translate-y-0.5
      hover:bg-[#4B6B3C]/10
      hover:text-[#4B6B3C]"
          >
            🔒 Privacy Policy
          </a>

          <a
            href="terms-of-use.html"
            className="rounded-full px-4 py-2 text-[10px] font-medium text-[#0B1F3B]
      transition-all duration-300
      hover:-translate-y-0.5
      hover:bg-[#4B6B3C]/10
      hover:text-[#4B6B3C]"
          >
            📋 Terms of Use
          </a>

          <a
            href="contact-support.html"
            className="rounded-full px-4 py-2 text-[10px] font-medium text-[#0B1F3B]
      transition-all duration-300
      hover:-translate-y-0.5
      hover:bg-[#4B6B3C]/10
      hover:text-[#4B6B3C]"
          >
            💬 Contact Support
          </a>
        </div>

        {/* COMPANY INFO */}
        <div className="text-[10px] leading-relaxed text-slate-500 mt-1">
          Developed &amp; Maintained by{" "}
          <strong className="font-semibold text-[#0B1F3B]">
            Vxtry Infotech Industry Private Limited
          </strong>
          <br />© 2026 All Rights Reserved | Authorized Internal Use Only
        </div>
      </div>
    </div>
  );
}
