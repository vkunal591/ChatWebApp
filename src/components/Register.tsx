import { BASE_URL } from "@/api";
import { useState } from "react";
interface Props {
  setUser: (user: any) => void;
}

export default function Register({ setUser }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const token = localStorage.getItem("token"); // admin token

    const res = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ token added
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "API failed");
    }

    const data = await res.json();
    console.log("REGISTER RESPONSE:", data);

    setUser("User registered successfully!");
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className=" w-full flex items-center justify-center overflow-hidden">
      {/* Register */}
      <div className="w-full  p-10">
        <h2 className="text-lg font-bold text-center text-[#0B1F3B] relative after:block after:w-12 after:h-1 after:bg-gradient-to-r after:from-[#4B6B3C] after:to-[#0B1F3B] after:mt-0">
          User Register
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="text-[10px]">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className=" text-[10px] w-full mb-1 p-4 h-[10px] flex items-center justify-center gap-2 
            bg-[#4B6B3C]/5 border border-[#4B6B3C]/10 rounded-lg] rounded-lg text-black"
            placeholder="Enter Username"
            required
          />
          <label className="text-[10px]">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black text-[10px] w-full mb-5 p-4 h-[10px] flex items-center justify-center gap-2 
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
              "Add User"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
