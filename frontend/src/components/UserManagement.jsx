import React, { useEffect, useState } from 'react';
import {
  fetchAllUsers,
  fetchUnapprovedUsers,
  approveUser,
  deleteUser,
  updateUser
} from '../../api/userApi';

const UserManagement = ({ token }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('unapproved');

  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    isApproved: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allRes, unapprovedRes] = await Promise.all([
          fetchAllUsers(token),
          fetchUnapprovedUsers(token)
        ]);
        setAllUsers(Array.isArray(allRes?.data) ? allRes.data : []);
        setUnapprovedUsers(Array.isArray(unapprovedRes?.data) ? unapprovedRes.data : []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      await approveUser(id, token);
      setUnapprovedUsers(unapprovedUsers.filter(user => user._id !== id));
      const res = await fetchAllUsers(token);
      setAllUsers(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Approval failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id, token);
      setAllUsers(allUsers.filter(u => u._id !== id));
      setUnapprovedUsers(unapprovedUsers.filter(u => u._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved
    });
  };

  const closeEditModal = () => setEditUser(null);

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const updated = await updateUser(editUser._id, formData, token);
      const updatedUsers = allUsers.map(u =>
        u._id === updated.data._id ? updated.data : u
      );
      setAllUsers(updatedUsers);
      closeEditModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'unapproved' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          onClick={() => setActiveTab('unapproved')}
        >
          Pending Approvals ({unapprovedUsers.length})
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Users ({allUsers.length})
        </button>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase text-gray-500 bg-gray-50">
              <tr className="border-b">
                <th className="py-3 pr-4 whitespace-nowrap">Name</th>
                <th className="py-3 pr-4 whitespace-nowrap">Email</th>
                <th className="py-3 pr-4 whitespace-nowrap">Role</th>
                <th className="py-3 pr-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(activeTab === 'unapproved' ? unapprovedUsers : allUsers).map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 pr-4 whitespace-nowrap">{user.name}</td>
                  <td className="py-4 pr-4 whitespace-nowrap">{user.email}</td>
                  <td className="py-4 pr-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'main' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap text-right space-x-2">
                    {activeTab === 'unapproved' ? (
                      <button
                        onClick={() => handleApprove(user._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                    ) : (
                      <>
                        <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-800">✏️</button>
                        <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-800">🗑️</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleEditChange}
                placeholder="Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEditChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
              >
                <option value="admin">Admin</option>
                <option value="main">Main</option>
                <option value="sub">Sub</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isApproved"
                  checked={formData.isApproved}
                  onChange={handleEditChange}
                />
                Approved
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeEditModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleEditSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
