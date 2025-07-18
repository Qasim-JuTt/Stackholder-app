import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Dashboard from "./pages/Dashboard";
import Stakeholders from "./pages/Stakeholders";
import ProjectManagement from "./pages/ProjectManage";
import FinanceTracker from "./pages/ProfitDistribution";
import FinanceDashboard from "./pages/DashboradFiance";
import ProjectFinance from "./pages/ProjectFinance";
import { SearchProvider } from "./context/searchContext";
import Login from "./auth/Login";
import SignUp from "./auth/Singup";
import NotificationComponent from "./components/Notification";
import SignUpUser from "./pages/SignUpUser";
import SignUpAdmin from "./pages/SignUpAdmin";
import ActivityTracker from "./components/ActivityTracker";
import RegisterPage from "./pages/RegisterPage";
import ManageUser from "./pages/ManageUser";
import History from "./pages/History";

function App() {
  return (
    <SearchProvider>
      <Router>
        <ActivityTracker /> {/* <Sidebar /> */}
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/manage-user" element={<ManageUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stakeholders" element={<Stakeholders />} />

          <Route path="/sign-up-user" element={<SignUpUser />} />
          <Route path="/sign-up-admin" element={<SignUpAdmin />} />
          {/* <Route path="/sign-up" element={<SignUp />} /> */}
          <Route path="/" element={<Login />} />
          {/* <Route path="/adduser" element={<AddUserForm />} /> */}

          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/financials" element={<FinanceDashboard />} />
          <Route path="/profit-distribution" element={<FinanceTracker />} />
          <Route path="/project-finance" element={<ProjectFinance />} />
          <Route path="/notification" element={<NotificationComponent />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </SearchProvider>
  );
}

export default App;
