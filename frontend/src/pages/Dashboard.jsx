import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectCard from "./ProjectCard";
import StakeholderCard from "../components/StackholdCard";

const Dashboard = () => {
  const [stakeholders] = useState({
    total: 120,
    active: 85,
    inactive: 35,
    new: 8,
  });

  const stakeholderStats = [
    {
      title: "Total Stakeholders",
      value: stakeholders.total,
      bg: "#16a34a",
    },
    {
      title: "Active Stakeholders",
      value: stakeholders.active,
      bg: "#2563eb",
    },
    {
      title: "Inactive Stakeholders",
      value: stakeholders.inactive,
       bg: "#7c3aed",
    },
    {
      title: "New Stakeholders",
      value: stakeholders.new,
      bg: "#f59e0b",
    },
  ];

  const stakeholderCards = [
    {
      projectName: "Project Alpha",
      completion: 76,
      price: 567,
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
          <h1 className="text-2xl font-bold mb-6 text-[#1e1e1e]">Dashboard</h1>

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

          {/* Project Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stakeholderCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow space-y-4"
              >
                <ProjectCard
                  projectName={card.projectName}
                  price={card.price}
                  completion={card.completion}
                  userImage={card.userImage}
                />
                <StakeholderCard stakeholderData={card.stakeholderData} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
