import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'
import Dashboard from './pages/Dashboard'
import Stakeholders from './pages/Stakeholders'
import ProjectManagement from './pages/ProjectManage'
import FinanceTracker from './pages/ProfitDistribution'
import FinanceDashboard from './pages/DashboradFiance'
import ProjectFinance from './pages/ProjectFinance'
import { SearchProvider } from './context/searchContext'

function App() {
  return (
    <SearchProvider>
    <Router>
      {/* You can uncomment Sidebar and if you want it on all pages */}
      {/* <Sidebar /> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stakeholders" element={<Stakeholders />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/financials" element={<FinanceDashboard/>} />
        <Route path="/profit-distribution" element={<FinanceTracker />} />
        <Route path="/project-finance" element={<ProjectFinance />} />

      </Routes>
    </Router>
    </SearchProvider>
  )
}

export default App
