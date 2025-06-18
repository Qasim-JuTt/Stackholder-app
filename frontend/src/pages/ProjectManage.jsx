import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Pagination from '../components/Pagination';
import InputField from '../components/InputField';

const initialModalData = {
  id: '',
  name: '',
  description: '',
  value: '',
  completion: 0,
};

const completionColor = (value) =>
  value < 30 ? 'bg-red-500' : value < 70 ? 'bg-yellow-500' : 'bg-green-500';

const ProjectManagement = () => {
  const projectsPerPage = 5;

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(initialModalData);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects/getAll');
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      }
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);

  const handleSave = async () => {
    try {
      if (!modalData.id) {
        const res = await axios.post('http://localhost:5000/api/projects/create', modalData);
        setProjects([...projects, res.data]);
      } else {
        const res = await axios.put(`http://localhost:5000/api/projects/update/${modalData.id}`, modalData);
        setProjects(projects.map(p => (p._id === modalData.id ? res.data : p)));
      }
      setIsModalOpen(false);
      setModalData(initialModalData);
    } catch (err) {
      console.error('Error saving/updating project:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm(`Are you sure you want to delete this project? ${id}`)) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/delete/${id}`);
        setProjects(projects.filter(p => p._id !== id));
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-25 fixed md:relative z-40"><Sidebar /></div>

      <div className="flex-1 md:ml-40">
        <Navbar />
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Project Management</h1>
            <button onClick={() => { setModalData(initialModalData); setIsModalOpen(true); }} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
              <Plus className="w-5 h-5 mr-2" /> Add Project
            </button>
          </div>

          <div className={`bg-white p-6 rounded-xl ${filtered.length > 0 ? 'shadow-sm' : ''}`}>
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No projects found. {searchTerm && 'Try a different search.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-gray-500 border-b">
                    <tr>
                      <th className="py-3 pr-4">Name</th>
                      <th className="py-3 pr-4">Description</th>
                      <th className="py-3 pr-4">Value</th>
                      <th className="py-3 pr-4">Completion</th>
                      <th className="py-3 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginated.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="py-4 pr-4 font-medium">{p.name}</td>
                        <td className="py-4 pr-4 text-gray-600">{p.description}</td>
                        <td className="py-4 pr-4 text-indigo-600 font-semibold">${p.value?.toLocaleString()}</td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div className={`h-2.5 rounded-full ${completionColor(p.completion)}`} style={{ width: `${p.completion}%` }} />
                            </div>
                            <span className="text-sm text-gray-500">{p.completion}%</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-right space-x-2">
                          <button onClick={() => { setModalData({ ...p, id: p._id }); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800"><Pencil className="w-5 h-5" /></button>
                          <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {filtered.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filtered.length / projectsPerPage)}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-indigo-700">{modalData.id ? 'Edit Project' : 'Add Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400 hover:text-red-500">&times;</button>
            </div>

            <div className="space-y-4">
              <InputField type="text" placeholder="Project Name" value={modalData.name} onChange={e => setModalData({ ...modalData, name: e.target.value })} />
              <InputField type="text" placeholder="Description" textarea value={modalData.description} onChange={e => setModalData({ ...modalData, description: e.target.value })} />
              <InputField type="number" placeholder="Value ($)" value={modalData.value} onChange={e => setModalData({ ...modalData, value: Number(e.target.value) })} />
              <div>
                <label className="block text-sm font-medium text-gray-700">Completion: {modalData.completion}%</label>
                <input type="range" min="0" max="100" value={modalData.completion} onChange={e => setModalData({ ...modalData, completion: parseInt(e.target.value, 10) })} className="w-full h-2 bg-gray-200 rounded-lg" />
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                {modalData.id ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
