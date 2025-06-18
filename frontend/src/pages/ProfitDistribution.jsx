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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ProfitDistribution = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects/profit-distribution"); // update URL accordingly
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
    const totalExpense = projects.reduce((sum, p) => sum + p.project.totalExpense, 0);
    const totalProfit = totalBudget - totalExpense;
    const avgCompletion = Math.round((projects.length * 100) / projects.length); // placeholder if no completion %

    return [
      { title: "Total Profit", value: `$${totalProfit.toLocaleString()}`, bg: "#16a34a" },
      { title: "Total Budget", value: `$${totalBudget.toLocaleString()}`, bg: "#2563eb" },
      { title: "Total Expenditure", value: `$${totalExpense.toLocaleString()}`, bg: "#7c3aed" },
      { title: "Avg. Completion", value: `${avgCompletion}%`, bg: "#f59e0b" },
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
          <h1 className="text-2xl font-bold mb-6 text-[#1e1e1e]">Profit Distribution</h1>

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
                    completion={100} // Or fetch from backend if available
                    userImage="https://randomuser.me/api/portraits/lego/2.jpg"
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
