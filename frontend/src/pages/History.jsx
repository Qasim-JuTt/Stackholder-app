import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// Mock data
const mockLogs = [
  {
    id: 1,
    user: 'Admin',
    action: 'Login',
    page: 'Dashboard',
    description: 'Admin logged into the dashboard',
    timestamp: '2025-06-24T10:15:30',
  },
  {
    id: 2,
    user: 'Ali',
    action: 'Create',
    page: 'Project',
    description: 'Ali created a new project: "Smart ERP"',
    timestamp: '2025-06-24T11:22:45',
  },
  {
    id: 3,
    user: 'Saad',
    action: 'Edit',
    page: 'User',
    description: 'Saad updated user role to "Manager"',
    timestamp: '2025-06-24T12:00:00',
  },
  {
    id: 4,
    user: 'Qasim',
    action: 'Delete',
    page: 'Finance',
    description: 'Qasim deleted transaction ID #9583',
    timestamp: '2025-06-24T13:35:10',
  },
  {
    id: 5,
    user: 'Admin',
    action: 'Visit',
    page: 'Settings',
    description: 'Admin visited settings page',
    timestamp: '2025-06-24T14:05:00',
  },
];

const actionColors = {
  Login: 'bg-blue-100 text-blue-700',
  Create: 'bg-green-100 text-green-700',
  Edit: 'bg-yellow-100 text-yellow-700',
  Delete: 'bg-red-100 text-red-700',
  Visit: 'bg-purple-100 text-purple-700',
};

const History = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = mockLogs.filter((log) => {
    const [date, time] = log.timestamp.split('T');
    return (
      (!selectedDate || date === selectedDate) &&
      (!selectedTime || time.startsWith(selectedTime)) &&
      (!selectedAction || log.action === selectedAction) &&
      (!selectedUser || log.user === selectedUser) &&
      (!searchTerm || log.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="flex h-screen bg-[#f4f7fe]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f1b42] text-white fixed h-full shadow-lg z-10">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6 pt-20 overflow-y-auto h-full">
          <h2 className="text-2xl font-semibold mb-6">📜 Website Activity Logs</h2>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="time"
              step="1"
              placeholder='HH:MM:SS'
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">All Actions</option>
              {['Login', 'Create', 'Edit', 'Delete', 'Visit'].map((act) => (
                <option key={act}>{act}</option>
              ))}
            </select>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">All Users</option>
              {[...new Set(mockLogs.map((log) => log.user))].map((user) => (
                <option key={user}>{user}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border bg-white rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left">#</th>
                  <th className="px-4 py-2 border text-left">User</th>
                  <th className="px-4 py-2 border text-left">Action</th>
                  <th className="px-4 py-2 border text-left">Page</th>
                  <th className="px-4 py-2 border text-left">Description</th>
                  <th className="px-4 py-2 border text-left">Date</th>
                  <th className="px-4 py-2 border text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => {
                    const [date, time] = log.timestamp.split('T');
                    return (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border">{log.user}</td>
                        <td className="px-4 py-2 border">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${actionColors[log.action]}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-2 border">{log.page}</td>
                        <td className="px-4 py-2 border">{log.description}</td>
                        <td className="px-4 py-2 border">{date}</td>
                        <td className="px-4 py-2 border">{time}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Placeholder (Future Use) */}
          <div className="mt-6 flex justify-end">
            <button className="bg-gray-200 px-4 py-2 rounded mr-2">Previous</button>
            <button className="bg-gray-200 px-4 py-2 rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
