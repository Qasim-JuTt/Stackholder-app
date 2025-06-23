import React from 'react';
import UserManagement from '../components/UserManagement';

const AdminDashboard = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <p className="text-red-600 font-semibold">Not authorized: No token found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <UserManagement token={token} />
    </div>
  );
};

export default AdminDashboard;