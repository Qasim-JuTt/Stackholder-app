import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectCard from "./ProjectCard";
import StakeholderCard from "../components/StackholdCard";
import { useSearch } from "../context/searchContext";
import Notifications from "../components/Notification";

const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm, searchResults } = useSearch();

  const [stakeholders, setStakeholders] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    new: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const userId = JSON.parse(storedUser).id;
      try {
        const res = await axios.get(
          `${apiUrl}/api/stakeholders/stats?userId=${userId}`
        );
        setStakeholders(res.data);
      } catch (err) {
        console.error("Error fetching stakeholder stats:", err);
      }
    };

    fetchStats();
  }, []);

  const stakeholderStats = [
    { title: "Total Stakeholders", value: stakeholders.total, bg: "#16a34a" },
    { title: "New Stakeholders", value: stakeholders.new, bg: "#f59e0b" },
  ];

  useEffect(() => {
    const fetchProjectsAndExpenses = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        console.error("User ID not found in localStorage");
        return;
      }

      try {
        // Step 1: Fetch projects with stakeholders
        const stakeholdersRes = await axios.get(
          `${apiUrl}/api/projects/with-stakeholders?userId=${user.id}`
        );

        // Step 2: Fetch project total expenses
        const expensesRes = await axios.get(`${apiUrl}/api/projects/expenses`, {
          params: { userId: user.id },
        });

        // Step 3: Map expenses by project ID
        const expenseMap = {};
        expensesRes.data.forEach((proj) => {
          expenseMap[proj._id] = proj.totalExpenditure;
        });

        // Step 4: Merge expenses into project list
        const mergedProjects = stakeholdersRes.data.map((project) => ({
          ...project,
          totalExpenditure: expenseMap[project._id] || 0,
        }));

        // Step 5: Filter out projects with no stakeholders
        const filtered = mergedProjects.filter(
          (p) => p.stakeholders && p.stakeholders.length > 0
        );

        setProjectsData(filtered);
      } catch (error) {
        console.error("Failed to fetch projects or expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsAndExpenses();
  }, []);

  const getStakeholderSummary = (stakeholders = []) => {
    const summary = {};
    stakeholders.forEach(({ role, name, share }) => {
      const key = role.toLowerCase();
      if (!summary[key]) {
        summary[key] = { name, percentage: 0 };
      }
      summary[key].percentage += share;
    });
    return summary;
  };

  const displayedProjects =
    searchTerm.trim() !== "" && Array.isArray(searchResults)
      ? searchResults
      : Array.isArray(projectsData)
      ? projectsData
      : [];

  return (
    <div className="flex min-h-screen bg-[#f4f7fe] relative">
      {/* Sidebar */}
      <div className="w-64 bg-[#0f1b42] text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pr-60">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-[#1e1e1e]">Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stakeholderStats.map((stat, index) => (
              <div
                key={index}
                className="text-white p-4 rounded-xl shadow"
                style={{ backgroundColor: stat.bg }}
              >
                <p>{stat.title}</p>
                <h2 className="text-2xl font-bold">{stat.value}</h2>
              </div>
            ))}
          </div>

          {/* Projects */}
          {loading ? (
            <p>Loading projects and stakeholders...</p>
          ) : displayedProjects.length === 0 ? (
            searchTerm.trim() ? (
              <p>No matching projects found for "{searchTerm}"</p>
            ) : (
              <p>No projects available.</p>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 h-[400px] md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl p-4 shadow space-y-4"
                >
                  <ProjectCard
                    projectName={project.name}
                    price={project.value}
                    expense={project.totalExpenditure}
                    completion={project.completion || 100}
                  />

                  <StakeholderCard
                    stakeholderData={getStakeholderSummary(
                      project.stakeholders
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification Panel */}
      <div className="w-72 fixed top-0 right-0 z-50 h-screen">
        <Notifications />
      </div>
    </div>
  );
};

export default Dashboard;
