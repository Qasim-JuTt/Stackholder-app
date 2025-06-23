import React, { useEffect, useState } from 'react';
import { fetchAllUsers, fetchUnapprovedUsers, approveUser } from '../../api/userApi';

const UserManagement = ({ token }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('unapproved'); // 'unapproved' or 'all'

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
      // Refresh all users to update approval status
      const res = await fetchAllUsers(token);
      setAllUsers(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Approval failed');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
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

      {activeTab === 'unapproved' ? (
        <div className="border rounded shadow p-4">
          <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
          {unapprovedUsers.length === 0 ? (
            <p>No pending approvals.</p>
          ) : (
            <div className="space-y-2">
              {unapprovedUsers.map(user => (
                <div key={user._id} className="flex justify-between items-center border-b py-2">
                  <div>
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-600 ml-2">({user.email})</span>
                    <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">{user.role}</span>
                  </div>
                  <button
                    onClick={() => handleApprove(user._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded shadow p-4">
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allUsers.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'main' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.approved ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Approved</span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;