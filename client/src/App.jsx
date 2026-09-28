import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IncidentProvider } from './context/IncidentContext';
import TopNavbar from './components/TopNavbar';
import AlertBanner from './components/AlertBanner';
import ChatbotModal from './components/ChatbotModal';

// Pages
import DashboardPage from './pages/DashboardPage';
import IncidentWorkspacePage from './pages/IncidentWorkspacePage';

function App() {
  return (
    <IncidentProvider>
      <Router>
        <div className="app-container app-layout-topbar">
          {/* Horizontal Clean Top Navigation Bar (Overview | Incidents | 🔔 | AI Copilot) */}
          <TopNavbar />

          {/* Main Application Area */}
          <main className="main-content">
            {/* Application Views Routing */}
            <Routes>
              {/* Landing Monitoring Workstation */}
              <Route path="/" element={<DashboardPage />} />

              {/* Dedicated Incident Workspace (Progressive Disclosure) */}
              <Route path="/incident" element={<IncidentWorkspacePage />} />

              {/* Seamless redirection for legacy links into Incident Workspace tabs */}
              <Route path="/map" element={<Navigate to="/incident?tab=map" replace />} />
              <Route path="/vessels" element={<Navigate to="/incident?tab=vessels" replace />} />
              <Route path="/history" element={<Navigate to="/incident?tab=history" replace />} />
              <Route path="/forecast" element={<Navigate to="/incident?tab=forecast" replace />} />
              <Route path="/report" element={<Navigate to="/incident?tab=report" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Floating AI Intelligence Assistant */}
          <ChatbotModal />
        </div>
      </Router>
    </IncidentProvider>
  );
}

export default App;
