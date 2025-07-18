import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectCard from "./ProjectCard";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ProfitDistribution = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;

        const res = await axios.get(
          `${apiUrl}/api/projects/profit-distribution?userId=${userId}`
        );
        setProjects(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profit data", error);
      }
    };

    fetchProfitData();
  }, []);

  const calcStats = () => {
    const totalBudget = projects.reduce((sum, p) => sum + p.project.value, 0);
    const totalExpenditure = projects.reduce(
      (sum, p) => sum + p.project.totalExpenditure,
      0
    );
    const totalProfit = totalBudget - totalExpenditure;
    const avgCompletion = Math.round(
      projects.reduce((sum, p) => sum + (p.project.completion || 100), 0) /
        projects.length
    );

    return [
      {
        title: "Total Income",
        value: `$${totalBudget.toLocaleString()}`,
        bg: "#2563eb",
      },
      {
        title: "Total Expenditure",
        value: `$${totalExpenditure.toLocaleString()}`,
        bg: "#7c3aed",
      },
      {
        title: "Total Profit",
        value: `$${totalProfit.toLocaleString()}`,
        bg: "#16a34a",
      },
      {
        title: "Avg. Completion",
        value: `${avgCompletion}%`,
        bg: "#f59e0b",
      },
    ];
  };

  const stakeholderStats = calcStats();

  return (
    <div className="flex min-h-screen bg-[#f4f7fe]">
      <aside className="w-64 bg-[#0f1b42] text-white">
        <Sidebar />
      </aside>

      <main className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-[#1e1e1e]">
            Profit Distribution
          </h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stakeholderStats.map((stat, index) => (
              <div
                key={index}
                className="text-white p-4 rounded-xl shadow"
                style={{ backgroundColor: stat.bg }}
              >
                <p className="text-sm">{stat.title}</p>
                <h2 className="text-2xl font-bold">{stat.value}</h2>
              </div>
            ))}
          </div>

          {/* Project Profit Shares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((item, index) => {
              const { project, stakeholderProfits } = item;

              const barData = {
                labels: stakeholderProfits.map((s) => s.name),
                datasets: [
                  {
                    label: "Profit Share ($)",
                    data: stakeholderProfits.map((s) => parseFloat(s.profit)),
                    backgroundColor: "#3b82f6",
                    borderRadius: 6,
                    barThickness: 30,
                  },
                ],
              };

              const barOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => `$${ctx.parsed.y.toLocaleString()}`,
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "#4b5563" },
                    grid: { display: false },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: "#4b5563",
                      callback: (v) => `$${v.toLocaleString()}`,
                    },
                    grid: {
                      borderDash: [4, 2],
                      color: "#e5e7eb",
                    },
                  },
                },
              };

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow space-y-2 h-[400px] flex flex-col justify-between"
                >
                  <ProjectCard
                    projectName={project.name}
                    price={project.value}
                    expense={project.totalExpenditure}
                    completion={project.completion || 100}
                  />

                  <div className="w-full h-48 px-2">
                    <Bar data={barData} options={barOptions} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfitDistribution;
