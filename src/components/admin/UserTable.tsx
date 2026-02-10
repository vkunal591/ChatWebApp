"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { BASE_URL } from "@/api";
import UpdateUserModal from "../modal/UpdateUserModal";

interface User {
  id: string; 
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  status: "online" | "offline";
  isBlocked: boolean;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "online" | "offline"
  >("all");

  const togglePassword = (id: string) => {
    setVisiblePasswords((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleBlock = async (id: string, currentValue: boolean) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/update-block-status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isBlocked: !currentValue, // 🔥 THIS WAS MISSING
        }),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      // ✅ update ONLY that user in UI
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isBlocked: !currentValue } : user,
        ),
      );
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const getUserList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/user-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const list = Array.isArray(data) ? data : data.data || [];
      const mappedUsers = list.map((u: any) => ({
        id: u.id || u._id,
        username: u.username,
        email: u.email,
        password: u.password,
        role: u.role,
        status: u.status,
        isBlocked: u.isBlocked,
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
const handleUpdate = (id: string, email: string) => {
  setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, email } : u)));
};
 const deleteUser = async (id: string) => {
   try {
     const token = localStorage.getItem("token");

     const res = await fetch(`${BASE_URL}/api/delete-user/${id}`, {
       method: "DELETE",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
       },
     });

     if (!res.ok) {
       throw new Error("Failed delete");
     }

     // ✅ correct state update
     setUsers((prev) => prev.filter((user) => user.id !== id));
   } catch (error) {
     console.error("Failed to delete user:", error);
   }
  };

  useEffect(() => {
    getUserList();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-10">Loading users...</div>
    );
  }
const filteredUsers = users.filter((user) => {
  const matchSearch = user.username
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchStatus =
    statusFilter === "all" ? true : user.status === statusFilter;

  return matchSearch && matchStatus;
});
  return (
    <div className="bg-[#081a34] rounded-xl overflow-hidden border border-[#0f2a4d]">
      <div className="flex flex-col md:flex-row gap-3 p-4 bg-[#081a34] border-b border-[#0f2a4d]">
        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 text-sm rounded-md bg-[#0b1f3c] text-white border border-[#0f2a4d] focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* ⬇ Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "online" | "offline")
          }
          className="w-full md:w-40 px-3 py-2 text-sm rounded-md bg-[#0b1f3c] text-white border border-[#0f2a4d] focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Users</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-[#0b1f3c]">
          <tr className="text-left text-gray-300">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Password</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Block</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => {
            const isVisible = visiblePasswords.includes(user.id);

            return (
              <tr
                key={user.id}
                className="border-t border-[#0f2a4d] hover:bg-[#0b1f3c] transition"
              >
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3 text-gray-300">{user.email}</td>

                {/* 🔐 Password toggle */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono tracking-wider">
                      {isVisible ? user.password : "••••••••"}
                    </span>

                    <button
                      onClick={() => togglePassword(user.id)}
                      className="text-gray-400 hover:text-white transition"
                      aria-label={isVisible ? "Hide password" : "Show password"}
                    >
                      {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      user.status === "online"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleBlock(user.id, user.isBlocked)}
                    className={`relative w-10 h-5 rounded-full transition ${
                      user.isBlocked ? "bg-red-500/40" : "bg-emerald-500/40"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform cursor-pointer${
                        user.isBlocked ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-emerald-400 hover:text-emerald-300 mr-3 cursor-pointer"
                  >
                    Edit
                  </button>
                  {selectedUser && (
                    <UpdateUserModal
                      user={selectedUser}
                      onClose={() => setSelectedUser(null)}
                      onUpdate={handleUpdate}
                    />
                  )}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
