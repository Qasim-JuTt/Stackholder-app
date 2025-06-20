import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";
const apiUrl = import.meta.env.VITE_API_URL;

const roleColors = {
  Developer: "text-blue-600",
  Client: "text-yellow-600",
  Investor: "text-green-600",
  Marketer: "text-pink-600",
};

const shareColor = (percentage) => {
  if (percentage < 10) return "bg-red-500";
  if (percentage < 20) return "bg-yellow-500";
  return "bg-green-500";
};

const Stakeholders = () => {
  const stakeholdersPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [stakeholders, setStakeholders] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [availableShare, setAvailableShare] = useState(100);
  const [modalData, setModalData] = useState({
    name: "",
    email: "",
    role: "",
    share: 0,
    responsibilities: "",
    project: "",
  });

 useEffect(() => {
  fetchStakeholders();

  const storedUser = localStorage.getItem("user");
  if (!storedUser) return;

  const user = JSON.parse(storedUser);
  const userId = user.id;

  axios
    .get(`${apiUrl}/api/projects/getName?userId=${userId}`)
    .then((res) => setProjectOptions(res.data))
    .catch((err) => console.error("Failed to fetch projects:", err));
}, []);


  const fetchStakeholders = () => {
    axios
      .get(`${apiUrl}/api/stakeholders`)
      .then((res) => setStakeholders(res.data))
      .catch((err) => console.error("Error fetching stakeholders:", err));
  };

  const filteredStakeholders = stakeholders.filter(({ name, email, role }) =>
    [name, email, role].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginated = filteredStakeholders.slice(
    (currentPage - 1) * stakeholdersPerPage,
    currentPage * stakeholdersPerPage
  );

  const handleEdit = (stakeholder) => {
    setModalData({ ...stakeholder, project: stakeholder.project._id });
    fetchAvailableShare(stakeholder.project._id);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setModalData({
      name: "",
      email: "",
      role: "",
      share: 0,
      responsibilities: "",
      project: "",
    });
    setAvailableShare(100);
    setModalOpen(true);
  };

  const handleSave = () => {
  // ✅ Get user from localStorage
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    alert("User not found in localStorage. Please log in again.");
    return;
  }

  const userObj = JSON.parse(storedUser);
  const userId = userObj?.id;
  if (!userId) {
    alert("User ID missing in localStorage.");
    return;
  }

  // ✅ Add user ID to the payload
  const payload = { ...modalData, user: userId };

  const request = modalData._id
    ? axios.put(`${apiUrl}/api/stakeholders/${modalData._id}`, payload)
    : axios.post(`${apiUrl}/api/stakeholders`, payload);

  request
    .then(() => {
      fetchStakeholders();
      setModalOpen(false);
    })
    .catch((err) => {
      console.error("Error saving stakeholder:", err);
      alert("Failed to save stakeholder");
    });
};


  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      axios.delete(`${apiUrl}/api/stakeholders/${id}`).then(() => {
        fetchStakeholders();
      });
    }
  };

  const fetchAvailableShare = async (projectId) => {
    // alert(projectId)
    if (!projectId) return setAvailableShare(100);

    try {
      const res = await axios.get(`${apiUrl}/api/projects/${projectId}/available-share`);
      const share = res.data.availableShare;
      setAvailableShare(share);

      if (modalData.share > share) {
        setModalData((prev) => ({ ...prev, share }));
      }
    } catch (error) {
      console.error("Failed to fetch available share", error);
      setAvailableShare(100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-indigo-600">Manage Stakeholders</h1>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" /> Add Stakeholder
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            {!filteredStakeholders.length ? (
              <p className="text-center py-8 text-gray-500">
                No stakeholders found. {searchTerm && "Try another search."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-gray-500 border-b">
                    <tr>
                      {["Name", "Email", "Role", "Responsibilities", "Project", "Share", "Actions"].map(
                        (h, i) => (
                          <th key={i} className="py-3 pr-4 text-left">
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paginated.map((stk) => (
                      <tr key={stk._id} className="hover:bg-gray-50 transition">
                        <td className="py-4 pr-4 font-medium">{stk.name}</td>
                        <td className="py-4 pr-4">{stk.email}</td>
                        <td className="py-4 pr-4">
                          <span className={`font-medium ${roleColors[stk.role]}`}>{stk.role}</span>
                        </td>
                        <td className="py-4 pr-4 text-gray-600">{stk.responsibilities}</td>
                        <td className="py-4 pr-4">{stk.project?.name}</td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className={`h-2.5 rounded-full ${shareColor(stk.share)}`}
                                style={{ width: `${stk.share}%` }}
                              ></div>
                            </div>
                            <span>{stk.share}%</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(stk)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil />
                          </button>
                          <button
                            onClick={() => handleDelete(stk._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {filteredStakeholders.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredStakeholders.length / stakeholdersPerPage)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl px-8 py-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold text-indigo-700">
                {modalData._id ? "Edit" : "Add"} Stakeholder
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-red-500 text-xl"
              >
                &times;
              </button>
            </div>

            <div className="grid gap-4 mt-4">
              <InputField
                label="Name"
                placeholder="Name"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              />

              <InputField
                label="Email"
                type="email"
                placeholder="Email"
                value={modalData.email}
                onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
              />

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
                <select
                  value={modalData.role}
                  onChange={(e) => setModalData({ ...modalData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="">Select a role</option>
                  <option value="Developer">Developer</option>
                  <option value="Client">Client</option>
                  <option value="Investor">Investor</option>
                  <option value="Marketer">Marketer</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Project</label>
                <select
                  value={modalData.project}
                  onChange={(e) => {
                    const projectId = e.target.value;
                    setModalData({ ...modalData, project: projectId });
                    fetchAvailableShare(projectId);
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="">Select a project</option>
                  {projectOptions.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <InputField
                label="Responsibilities"
                textarea
                placeholder="Responsibilities"
                value={modalData.responsibilities}
                onChange={(e) =>
                  setModalData({ ...modalData, responsibilities: e.target.value })
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Share: <span className="text-indigo-600">{modalData.share}%</span>
                  <span className="text-sm text-gray-500 ml-2">(Available: {availableShare}%)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={availableShare}
                  value={modalData.share}
                  onChange={(e) =>
                    setModalData({ ...modalData, share: +e.target.value })
                  }
                  className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-1.5 text-sm text-gray-700 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stakeholders;
