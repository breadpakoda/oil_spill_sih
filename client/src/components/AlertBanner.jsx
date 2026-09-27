import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Radio } from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

const AlertBanner = () => {
  const { activeIncident } = useIncident();
  const navigate = useNavigate();

  if (!activeIncident) return null;

  return (
    <div className="alert-banner">
      <div className="alert-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="badge badge-danger badge-pulse">
            <AlertTriangle size={12} />
            NEW OIL SPILL DETECTED
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
            Detected: <strong>{activeIncident.displayDate}</strong>
          </div>
          <div>
            Location: <strong>{activeIncident.locationName.split('(')[0].trim()}</strong>
          </div>
          <div>
            Confidence: <strong style={{ color: 'var(--primary)' }}>{activeIncident.confidence}%</strong>
          </div>
          <div>
            Status: <span className="badge badge-warning">{activeIncident.status}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/incident')}
        className="btn btn-sm btn-primary"
        style={{ flexShrink: 0 }}
      >
        <Radio size={14} />
        <span>Open Incident</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default AlertBanner;
