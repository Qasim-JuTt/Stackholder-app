import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import InputField from '../components/InputField';
import Navbar from '../components/Navbar';

const allStakeholders = [
  {
    id: 'STK-1001', name: 'Ali Khan', email: 'ali.khan@example.com', role: 'Developer', share: 25, responsibilities: 'Frontend Development', project: 'Project Alpha',
  },
  {
    id: 'STK-1002', name: 'Sara Ahmed', email: 'sara.ahmed@example.com', role: 'Designer', share: 20, responsibilities: 'UI/UX Design', project: 'Project Alpha',
  },
  {
    id: 'STK-1003', name: 'Usman Raza', email: 'usman.raza@example.com', role: 'Backend Developer', share: 30, responsibilities: 'API Development', project: 'Project Beta',
  },
  {
    id: 'STK-1004', name: 'Fatima Noor', email: 'fatima.noor@example.com', role: 'Product Manager', share: 15, responsibilities: 'Project Coordination', project: 'Project Beta',
  },
  {
    id: 'STK-1005', name: 'Ahmed Bilal', email: 'ahmed.bilal@example.com', role: 'QA Engineer', share: 10, responsibilities: 'Quality Assurance', project: 'Project Gamma',
  },
  {
    id: 'STK-1006', name: 'Hina Zafar', email: 'hina.zafar@example.com', role: 'DevOps', share: 15, responsibilities: 'Infrastructure Management', project: 'Project Gamma',
  },
  {
    id: 'STK-1007', name: 'Zain Malik', email: 'zain.malik@example.com', role: 'Marketing', share: 10, responsibilities: 'Digital Marketing', project: 'Project Alpha',
  },
];

const roleColors = {
  Developer: 'text-blue-600',
  Designer: 'text-purple-600',
  'Backend Developer': 'text-green-600',
  'Product Manager': 'text-yellow-600',
  'QA Engineer': 'text-red-600',
  DevOps: 'text-indigo-600',
  Marketing: 'text-pink-600',
};

const shareColor = (percentage) => {
  if (percentage < 10) return 'bg-red-500';
  if (percentage < 20) return 'bg-yellow-500';
  return 'bg-green-500';
};

const Stakeholders = () => {
  const stakeholdersPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    id: '', name: '', email: '', role: '', share: 0, responsibilities: '', project: '',
  });

  const filteredStakeholders = allStakeholders.filter(stakeholder =>
    stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stakeholder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stakeholder.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * stakeholdersPerPage;
  const indexOfFirst = indexOfLast - stakeholdersPerPage;
  const currentStakeholders = filteredStakeholders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStakeholders.length / stakeholdersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSave = () => {
    console.log('Saved stakeholder:', modalData);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this stakeholder?')) {
      console.log('Delete stakeholder:', id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-600">Manage Stakeholders</h1>

            <button
              onClick={() => {
                setModalData({ id: '', name: '', email: '', role: '', share: 0, responsibilities: '', project: '' });
                setModalOpen(true);
              }}
              className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Add Stakeholder</span>
            </button>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
            {filteredStakeholders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No stakeholders found. {searchTerm ? 'Try a different search.' : 'Add a stakeholder to get started.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left">
                    <tr className="text-gray-500 border-b">
                      <th className="py-3 pr-4 whitespace-nowrap">Name</th>
                      <th className="py-3 pr-4 whitespace-nowrap">Email</th>
                      <th className="py-3 pr-4 whitespace-nowrap">Role</th>
                      <th className="py-3 pr-4 whitespace-nowrap">Responsibilities</th>
                      <th className="py-3 pr-4 whitespace-nowrap">Project</th>
                      <th className="py-3 pr-4 whitespace-nowrap">Share</th>
                      <th className="py-3 pr-4 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentStakeholders.map((stakeholder) => (
                      <tr key={stakeholder.id} className="hover:bg-gray-50 transition">
                        <td className="py-4 pr-4 whitespace-nowrap font-medium">{stakeholder.name}</td>
                        <td className="py-4 pr-4 whitespace-nowrap">{stakeholder.email}</td>
                        <td className="py-4 pr-4">
                          <span className={`text-sm font-medium ${roleColors[stakeholder.role]}`}>
                            {stakeholder.role}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-sm text-gray-600">{stakeholder.responsibilities}</td>
                        <td className="py-4 pr-4 text-sm text-gray-700">{stakeholder.project}</td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className={`h-2.5 rounded-full ${shareColor(stakeholder.share)}`}
                                style={{ width: `${stakeholder.share}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">{stakeholder.share}%</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setModalData(stakeholder);
                              setModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(stakeholder.id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-bold text-indigo-700">
                {modalData.id ? 'Edit Stakeholder' : 'Add Stakeholder'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="text-gray-500 hover:text-red-500 text-2xl transition duration-200"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 mt-6">
              <InputField
                type="text"
                placeholder="Name"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              />
              <InputField
                type="email"
                placeholder="Email"
                value={modalData.email}
                onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
              />
              <InputField
                type="text"
                placeholder="Role"
                value={modalData.role}
                onChange={(e) => setModalData({ ...modalData, role: e.target.value })}
              />

              {/* Project Select Box */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  value={modalData.project}
                  onChange={(e) => setModalData({ ...modalData, project: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a project</option>
                  <option value="Project Alpha">Project Alpha</option>
                  <option value="Project Beta">Project Beta</option>
                  <option value="Project Gamma">Project Gamma</option>
                </select>
              </div>

              <InputField
                type="text"
                placeholder="Responsibilities"
                value={modalData.responsibilities}
                onChange={(e) => setModalData({ ...modalData, responsibilities: e.target.value })}
                textarea
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share: <span className="text-indigo-600 font-semibold">{modalData.share}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={modalData.share}
                  onChange={(e) => setModalData({ ...modalData, share: parseInt(e.target.value) })}
                  className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t mt-8">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 text-gray-700 border rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
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
