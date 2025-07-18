import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const actionColors = {
  Login: "bg-blue-100 text-blue-700",
  Create: "bg-green-100 text-green-700",
  Edit: "bg-yellow-100 text-yellow-700",
  Delete: "bg-red-100 text-red-700",
  Visit: "bg-purple-100 text-purple-700",
};

const History = () => {
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get("/api/activity/summary");

        const combined = [];

        // Safe Page Visits Parsing
        if (Array.isArray(data?.pageVisits)) {
          data.pageVisits.forEach((visit) => {
            const [date, time] = visit.timestamp?.split("T") || [
              "Unknown",
              "Unknown",
            ];
            combined.push({
              id: visit._id,
              user: "Unknown", // or resolve user name from userId
              action: "Visit",
              page: visit.page,
              description: `Visited ${visit.page}`,
              date,
              time: time?.split(".")[0] || "Unknown",
            });
          });
        }

        // Safe Change Logs Parsing
        if (Array.isArray(data?.changeLogs)) {
          data.changeLogs.forEach((log) => {
            const [date, time] = log.updatedAt?.split("T") || [
              "Unknown",
              "Unknown",
            ];
            combined.push({
              id: log._id,
              user: log.updatedBy || "Unknown",
              action:
                log.operation?.charAt(0).toUpperCase() +
                log.operation?.slice(1),
              page: log.model,
              description: `${log.updatedBy || "Unknown"} performed ${
                log.operation
              } on ${log.model}`,
              date,
              time: time?.split(".")[0] || "Unknown",
            });
          });
        }

        // Sort by latest date-time
        combined.sort(
          (a, b) =>
            new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)
        );
        setLogs(combined);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    return (
      (!selectedDate || log.date === selectedDate) &&
      (!selectedTime || log.time.startsWith(selectedTime)) &&
      (!selectedAction || log.action === selectedAction) &&
      (!selectedUser || log.user === selectedUser) &&
      (!searchTerm ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="flex h-screen bg-[#f4f7fe]">
      <aside className="w-64 bg-[#0f1b42] text-white fixed h-full shadow-lg z-10">
        <Sidebar />
      </aside>

      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6 pt-20 overflow-y-auto h-full">
          <h2 className="text-2xl font-semibold mb-6">
            📜 Website Activity Logs
          </h2>

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
              {["Login", "Create", "Edit", "Delete", "Visit"].map((act) => (
                <option key={act}>{act}</option>
              ))}
            </select>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">All Users</option>
              {[...new Set(logs.map((log) => log.user))].map((user) => (
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
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm overflow-x-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No logs found.
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="text-left">
                  <tr className="text-gray-500 border-b">
                    <th className="py-3 pr-4 whitespace-nowrap">#</th>
                    <th className="py-3 pr-4 whitespace-nowrap">User</th>
                    <th className="py-3 pr-4 whitespace-nowrap">Action</th>
                    <th className="py-3 pr-4 whitespace-nowrap">Page</th>
                    <th className="py-3 pr-4 whitespace-nowrap">Description</th>
                    <th className="py-3 pr-4 whitespace-nowrap">Date</th>
                    <th className="py-3 pr-4 whitespace-nowrap">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.map((log, index) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition">
                      <td className="py-4 pr-4 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        {log.user}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            actionColors[log.action] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        {log.page}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap text-gray-600">
                        {log.description}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        {log.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-6 flex justify-end">
            <button className="bg-gray-200 px-4 py-2 rounded mr-2">
              Previous
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
