import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Plus } from "lucide-react";

import Navbar from "../components/Navbar";
import UserManagement from "../components/UserManagement";
import RegisterModal from "./RegisterPage";

const ManageUser = () => {
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 text-xl font-semibold bg-white p-4 rounded shadow">
          Not authorized: No token found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f7fe]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f1b42] text-white fixed h-full shadow-lg z-10">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main className="p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">
              Project Management
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="w-5 h-5 mr-2" /> Add User
            </button>

            {/* Modal */}
            <RegisterModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>

          {/* Full-width User Management Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <UserManagement token={token} />
          </div>

          {/* Error Display */}
          {error && (
            <p className="text-red-600 mt-6 bg-red-100 border border-red-400 p-4 rounded">
              {error}
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageUser;
