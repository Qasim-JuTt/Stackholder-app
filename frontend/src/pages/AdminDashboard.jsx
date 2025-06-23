import React, { useState } from 'react';
import AdminApproval from '../components/AdminApproval';
import UserManagement from '../components/UserManagement';

const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  const [error, setError] = useState(null);

  if (!token) {
    return <p className="text-red-600 font-semibold">Not authorized: No token found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AdminApproval token={token} onError={setError} />
      <UserManagement token={token} />
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default AdminDashboard;
