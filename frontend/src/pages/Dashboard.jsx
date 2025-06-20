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

  const [stakeholders] = useState({
    total: 120,
    active: 85,
    inactive: 35,
    new: 8,
  });

  const stakeholderStats = [
    { title: "Total Stakeholders", value: stakeholders.total, bg: "#16a34a" },
    { title: "Active Stakeholders", value: stakeholders.active, bg: "#2563eb" },
    { title: "Inactive Stakeholders", value: stakeholders.inactive, bg: "#7c3aed" },
    { title: "New Stakeholders", value: stakeholders.new, bg: "#f59e0b" },
  ];

  useEffect(() => {
    const fetchProjectsWithStakeholders = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/projects/with-stakeholders`);
        const filteredProjects = response.data.filter(
          (project) => project.stakeholders && project.stakeholders.length > 0
        );
        setProjectsData(filteredProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsWithStakeholders();
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
    searchTerm.trim() !== '' && Array.isArray(searchResults)
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
      <div className="flex-1 flex flex-col pr-72"> {/* Reserve space for notification */}
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
                    price={project.value || 0}
                    completion={project.completion || 0}
                    userImage={`${apiUrl}/api/portraits/lego/1.jpg`}
                  />
                  <StakeholderCard
                    stakeholderData={getStakeholderSummary(project.stakeholders)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 📍 Notification - fixed to right side */}
<div className="w-72 fixed top-0 right-0 z-50 h-screen">
        <Notifications />
      </div>
    </div>
  );
};

export default Dashboard;
