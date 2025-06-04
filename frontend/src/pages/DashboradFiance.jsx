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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FinanceDashboard = () => {
  const stakeholderCards = [
    {
      projectName: "Project Alpha",
      completion: 76,
      price: 567,
      budget: 100000,
      expenditure: 65000,
      userImage: "https://randomuser.me/api/portraits/women/44.jpg",
      stakeholderData: {
        customer: { name: "Ali Khan", percentage: 20 },
        investor: { name: "Sarah Lee", percentage: 30 },
        employee: { name: "John Doe", percentage: 25 },
        partner: { name: "Zara Patel", percentage: 15 },
        vendor: { name: "Bilal Zain", percentage: 10 },
      },
    },
    {
      projectName: "Project Beta",
      completion: 85,
      price: 567,
      budget: 150000,
      expenditure: 120000,
      userImage: "https://randomuser.me/api/portraits/men/55.jpg",
      stakeholderData: {
        customer: { name: "Ahmed Raza", percentage: 20 },
        investor: { name: "Fatima Noor", percentage: 30 },
        employee: { name: "David Chen", percentage: 25 },
        partner: { name: "Emily Tan", percentage: 15 },
        vendor: { name: "Bilal Zain", percentage: 10 },
      },
    },
    {
      projectName: "Project Gamma",
      completion: 92,
      price: 567,
      budget: 200000,
      expenditure: 180000,
      userImage: "https://randomuser.me/api/portraits/women/65.jpg",
      stakeholderData: {
        customer: { name: "Saima Malik", percentage: 20 },
        investor: { name: "Ali Rehman", percentage: 30 },
        employee: { name: "Usman Tariq", percentage: 25 },
        partner: { name: "Mehwish Asad", percentage: 15 },
        vendor: { name: "Bilal Zain", percentage: 10 },
      },
    },
  ];

  // Financial Calculations
  const totalBudget = stakeholderCards.reduce((sum, p) => sum + p.budget, 0);
  const totalExpenditure = stakeholderCards.reduce((sum, p) => sum + p.expenditure, 0);
  const remainingFunds = totalBudget - totalExpenditure;
  const avgCompletion = Math.round(
    stakeholderCards.reduce((sum, p) => sum + p.completion, 0) / stakeholderCards.length
  );

  const stakeholderStats = [
    {
      title: "Total Budget",
      value: `$${totalBudget.toLocaleString()}`,
      bg: "#16a34a",
    },
    {
      title: "Total Expenditure",
      value: `$${totalExpenditure.toLocaleString()}`,
      bg: "#2563eb",
    },
    {
      title: "Remaining Funds",
      value: `$${remainingFunds.toLocaleString()}`,
      bg: "#7c3aed",
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      bg: "#f59e0b",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f4f7fe]">
      {/* Sidebar */}
      <div className="w-64 bg-[#0f1b42] text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-[#1e1e1e]">Finance Dashboard</h1>

          {/* Stats Section */}
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

          {/* Project Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stakeholderCards.map((card, index) => {
              const barData = {
                labels: ["Budget", "Expenditure"],
                datasets: [
                  {
                    label: "Amount ($)",
                    data: [card.budget, card.expenditure],
                    backgroundColor: ["#2563eb", "#ef4444"],
                    borderRadius: 8,
                    barThickness: 40,
                  },
                ],
              };

              const barOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                      color: "#374151",
                      font: {
                        size: 12,
                        weight: "bold",
                      },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.parsed.y.toLocaleString()}`,
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "#4b5563",
                      font: {
                        size: 12,
                      },
                    },
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: "#4b5563",
                      callback: (value) => `$${value.toLocaleString()}`,
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
                  className="bg-white rounded-xl p-4 shadow space-y-4 h-[480px] overflow-hidden flex flex-col justify-between"
                >
                  <ProjectCard
                    projectName={card.projectName}
                    price={card.price}
                    completion={card.completion}
                    userImage={card.userImage}
                  />

                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full h-56 px-4">
                      <Bar data={barData} options={barOptions} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
