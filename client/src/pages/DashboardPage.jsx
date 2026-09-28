import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import LeafletMap from '../components/LeafletMap';

const DashboardPage = () => {
  const { activeIncident } = useIncident();

  if (!activeIncident) {
    return (
      <div className="landing-loading-state">
        <div className="loading-spinner" />
        <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Initializing Maritime Surveillance Feed…
        </span>
      </div>
    );
  }

  return (
    <div className="landing-workstation-wrapper">
      {/* ── Floating Minimal Incident Alert (Top Center - Informational Only) ── */}
      <div className="floating-incident-card">
        <div className="incident-alert-indicator">
          <AlertTriangle size={15} className="alert-pulse-icon" />
        </div>

        <div className="incident-alert-info">
          <div className="incident-alert-headline">
            NEW OIL SPILL DETECTED
          </div>
          <div className="incident-alert-subline">
            <span>{activeIncident.locationName?.split('(')[0]?.trim() || 'Arabian Sea'}</span>
            <span className="incident-bullet">•</span>
            <span className="mono font-bold">{activeIncident.id}</span>
          </div>
        </div>
      </div>

      {/* ── Spacious 90%+ Operational Map ── */}
      <div className="landing-map-canvas">
        <LeafletMap height="100%" mode="overview" />
      </div>
    </div>
  );
};

export default DashboardPage;
