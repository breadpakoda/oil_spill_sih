import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Radio } from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

const AlertBanner = () => {
  const { activeIncident } = useIncident();
  const navigate = useNavigate();
  const location = useLocation();

  // On the landing page (/), the alert is displayed as a sleek floating chip directly on the map
  if (!activeIncident || location.pathname === '/') return null;

  return (
    <div className="alert-banner">
      <div className="alert-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="badge badge-danger badge-pulse">
            <AlertTriangle size={12} />
            ACTIVE INCIDENT
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {activeIncident.title}
          </span>
        </div>

        <div className="alert-meta">
          <div>
            Incident: <strong>{activeIncident.id}</strong>
          </div>
          <div>
            Location: <strong>{activeIncident.locationName.split('(')[0].trim()}</strong>
          </div>
          <div>
            Confidence: <strong style={{ color: 'var(--primary)' }}>{activeIncident.confidence}%</strong>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/incident')}
        className="btn btn-sm btn-primary"
        style={{ flexShrink: 0 }}
      >
        <Radio size={14} />
        <span>Incident Detail</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default AlertBanner;
