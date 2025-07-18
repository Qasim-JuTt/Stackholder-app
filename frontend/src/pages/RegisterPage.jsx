import React from "react";
import { X } from "lucide-react";
import RegisterForm from "../components/RegisterForm";

const RegisterModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Add New User</h2>

          {/* Registration Form */}
          <RegisterForm />

          {/* Cancel Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
