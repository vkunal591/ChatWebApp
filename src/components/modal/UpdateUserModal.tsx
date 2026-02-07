import { BASE_URL } from "@/api";
import { useState } from "react";
import { X } from "lucide-react"; // optional, you can remove icon lib

interface Props {
  user: { id: string; email: string };
  onClose: () => void;
  onUpdate: (id: string, email: string) => void;
}

export default function UpdateUserModal({ user, onClose, onUpdate }: Props) {
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/update-user/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to update user");

      onUpdate(user.id, email);
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative bg-white w-[380px] rounded-xl shadow-2xl p-6">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-1 text-center underline">
          Update User Email
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 text-left">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
              placeholder="Enter email"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="text-xs px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
