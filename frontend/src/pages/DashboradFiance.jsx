import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectCard from "./ProjectCard";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FinanceDashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects/expenses");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch project data", err);
      }
    };

    fetchProjects();
  }, []);

  const totalBudget = projects.reduce((sum, p) => sum + p.value, 0);
  const totalExpenditure = projects.reduce((sum, p) => sum + p.totalExpense, 0);
  const avgCompletion = projects.length
    ? Math.round(projects.reduce((sum, p) => sum + p.completion, 0) / projects.length)
    : 0;

  const stakeholderStats = [
    { title: "Total Budget", value: `$${totalBudget.toLocaleString()}`, bg: "#16a34a" },
    { title: "Total Expenditure", value: `$${totalExpenditure.toLocaleString()}`, bg: "#2563eb" },
    {
      title: "Remaining Funds",
      value: `$${(totalBudget - totalExpenditure).toLocaleString()}`,
      bg: "#7c3aed",
    },
    { title: "Avg. Completion", value: `${avgCompletion}%`, bg: "#f59e0b" },
  ];

  const getBarData = (budget, expenditure) => ({
    labels: ["Budget", "Expenditure"],
    datasets: [
      {
        label: "Amount ($)",
        data: [budget, expenditure],
        backgroundColor: ["#2563eb", "#ef4444"],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  });

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: { color: "#374151", font: { size: 12, weight: "bold" } },
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#4b5563", font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#4b5563",
          callback: (value) => `$${value.toLocaleString()}`,
        },
        grid: { borderDash: [4, 2], color: "#e5e7eb" },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fe]">
      <div className="w-64 bg-[#0f1b42] text-white">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-[#1e1e1e]">Finance Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stakeholderStats.map((stat, i) => (
              <div key={i} className="text-white p-4 rounded-xl shadow" style={{ backgroundColor: stat.bg }}>
                <p>{stat.title}</p>
                <h2 className="text-2xl font-bold">{stat.value}</h2>
              </div>
            ))}
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj, i) => (
              <div
                key={proj._id}
                className="bg-white rounded-xl p-3 shadow h-[400px] flex flex-col"
              >
                <div className="mb-4">
                  <ProjectCard
                    projectName={proj.name}
                    completion={proj.completion}
                    price={proj.value}
                    budget={proj.value}
                    expenditure={proj.totalExpense}
                    userImage={`https://randomuser.me/api/portraits/lego/${i + 1}.jpg`}
                  />
                </div>
                <div className="h-52  ">
                  <Bar data={getBarData(proj.value, proj.totalExpense)} options={barOptions} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
