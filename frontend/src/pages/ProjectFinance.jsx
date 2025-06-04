import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Pencil, Trash2, Plus } from "lucide-react";
import Pagination from "../components/Pagination";
import AddTransactionModal from "./AddProjectFiance";

const ProjectFinance = () => {
  const reportsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTransaction = (data) => {
    console.log("Transaction Added:", data);
    setReports((prev) => [data, ...prev]); // Add to top of list
  };

  useEffect(() => {
    const staticReports = [
      {
        id: "R001",
        amount: 1000,
        date: "2025-04-01",
        category: "Sales",
        project: "Q1 Campaign",
        description: "Quarterly sales performance",
        type: "income",
      },
      {
        id: "R002",
        amount: 200,
        date: "2025-04-05",
        category: "IT",
        project: "Downtime Fix",
        description: "Server maintenance",
        type: "expense",
      },
      {
        id: "R003",
        amount: 150,
        date: "2025-04-10",
        category: "Support",
        project: "Feedback Analysis",
        description: "Customer survey review",
        type: "expense",
      },
      {
        id: "R004",
        amount: 500,
        date: "2025-04-12",
        category: "Marketing",
        project: "Campaign A",
        description: "Ad spend",
        type: "expense",
      },
      {
        id: "R005",
        amount: 0,
        date: "2025-04-15",
        category: "IT",
        project: "Security",
        description: "Audit prep",
        type: "expense",
      },
      {
        id: "R006",
        amount: 2000,
        date: "2025-04-20",
        category: "HR",
        project: "Annual Review",
        description: "Employee bonuses",
        type: "expense",
      },
      {
        id: "R007",
        amount: 300,
        date: "2025-04-22",
        category: "Development",
        project: "Bug Fixes",
        description: "Patch deployment",
        type: "expense",
      },
    ];
    setReports(staticReports);
  }, []);

  const filteredReports = reports.filter(
    (r) =>
      r.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-25 fixed md:relative z-40">
        <Sidebar />
      </div>
      <div className="flex-1 md:ml-40">
        <Navbar />
        <main className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <h1 className="text-2xl font-bold text-indigo-600">Project Finance</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Transaction</span>
            </button>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No transactions found. {searchTerm ? 'Try a different search.' : 'Add a transaction to get started.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left">
                    <tr className="text-gray-500 border-b">
                      <th className="py-3 pr-4 whitespace-nowrap">ID</th>
                      <th className="py-3 pr-4 whitespace-nowrap">Amount</th>
                      <th className="py-3 pr-4 whitespace-nowrap">Date</th>
                      <th className="py-3 pr-4 whitespace-nowrap">Category</th>
                      <th className="py-3 pr-4 whitespace-nowrap">Project</th>
                      <th className="py-3 pr-4 whitespace-nowrap">Description</th>
                      <th className="py-3 pr-4 whitespace-nowrap">Type</th>
                      <th className="py-3 pr-4 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentReports.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 transition">
                        <td className="py-4 pr-4 whitespace-nowrap font-medium">{t.id}</td>
                        <td className={`py-4 pr-4 whitespace-nowrap ${
                          t.type === "income" ? "text-green-600" : "text-red-600"
                        } font-semibold`}>
                          ${t.amount.toLocaleString()}
                        </td>
                        <td className="py-4 pr-4 whitespace-nowrap text-gray-500">
                          {new Date(t.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 pr-4 whitespace-nowrap">{t.category}</td>
                        <td className="py-4 pr-4 whitespace-nowrap">{t.project}</td>
                        <td className="py-4 pr-4 whitespace-nowrap text-gray-600">{t.description || "-"}</td>
                        <td className="py-4 pr-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              t.type === "income"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-right space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <AddTransactionModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddTransaction={handleAddTransaction}
          />
        </main>
      </div>
    </div>
  );
};

export default ProjectFinance;