"use client";

import { useState } from "react";
import UserTable from "@/components/admin/UserTable";
import Modal from "@/components/modal/registerModal";
import Register from "@/components/Register";

export default function UsersPage() {
  const [openModal, setOpenModal] = useState<null | string>(null);

  return (
    <div className="min-h-screen bg-[#0b1f3c] p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-gray-300 text-sm">Manage all registered users</p>
        </div>

        {/* 🔹 Add User Button */}
        <button
          onClick={() => setOpenModal("register")}
          className="bg-emerald-500 hover:bg-emerald-600 transition px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add User
        </button>
      </div>

      {/* User Table */}
      <UserTable />
      
      {openModal === "register" && (
        <Modal onClose={() => setOpenModal(null)}>
          <Register onClose={() => setOpenModal(null)} />
        </Modal>
      )}
    </div>
  );
}
