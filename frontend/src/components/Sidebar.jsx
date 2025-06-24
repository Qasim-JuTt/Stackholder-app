import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaProjectDiagram,
  FaChartPie,
  FaFileExport,
  FaSignOutAlt,
  FaBars,
  FaWallet,
} from 'react-icons/fa';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'Projects', icon: <FaProjectDiagram />, path: '/projects' },
    { name: 'Stakeholders', icon: <FaUsers />, path: '/stakeholders' },
    { name: 'Project Financials', icon: <FaFileExport />, path: '/project-finance' },
    { name: 'Financial Dashboard', icon: <FaWallet />, path: '/financials' },
    { name: 'Profit Distribution', icon: <FaChartPie />, path: '/profit-distribution' },
    { name: 'Manage User', icon: <FaUsers />, path: '/manage-user' },

  ];

  const handleLogout = () => {
    localStorage.clear(); // Clear user data
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-4 fixed top-0 left-0 z-50">
        <button onClick={() => setOpen(!open)} className="text-white text-2xl">
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#152055] to-[#0f1b42] text-white p-6 z-40 transform transition-transform duration-300 ${
          open ? 'translate-x-0 w-64' : '-translate-x-full w-0'
        } md:translate-x-0 md:w-64`}
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="text-3xl">✅</div>
          <h1 className="text-sm tracking-wide font-semibold mt-1">STAKEHOLDER</h1>
          <p className="text-xs text-gray-300">MANAGEMENT</p>
        </div>

        {/* Menu */}
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                  isActive
                    ? 'bg-[#1e2a5a] text-white font-semibold'
                    : 'hover:bg-[#253468] text-gray-300'
                }`}
                onClick={() => setOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-md transition hover:bg-[#8b1e1e] text-gray-300 hover:text-white mt-4"
          >
            <span className="text-lg"><FaSignOutAlt /></span>
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
