import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IncidentProvider } from './context/IncidentContext';
import Sidebar from './components/Sidebar';
import AlertBanner from './components/AlertBanner';
import ChatbotModal from './components/ChatbotModal';

// Pages
import DashboardPage from './pages/DashboardPage';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import InteractiveMapPage from './pages/InteractiveMapPage';
import VesselAnalysisPage from './pages/VesselAnalysisPage';
import HistoricalIntelligencePage from './pages/HistoricalIntelligencePage';
import ForecastPage from './pages/ForecastPage';
import EvidenceReportPage from './pages/EvidenceReportPage';

function App() {
  return (
    <IncidentProvider>
      <Router>
        <div className="app-container">
          {/* Navigation Sidebar */}
          <Sidebar />

          {/* Main Application Area */}
          <main className="main-content">
            {/* Real-time Operational Alert Banner */}
            <AlertBanner />

            {/* Application Views Routing */}
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/incident" element={<IncidentDetailsPage />} />
              <Route path="/map" element={<InteractiveMapPage />} />
              <Route path="/vessels" element={<VesselAnalysisPage />} />
              <Route path="/history" element={<HistoricalIntelligencePage />} />
              <Route path="/forecast" element={<ForecastPage />} />
              <Route path="/report" element={<EvidenceReportPage />} />
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
