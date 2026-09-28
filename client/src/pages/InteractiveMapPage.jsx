import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map as MapIcon,
  Layers,
  Ship,
  Wind,
  Compass,
  ArrowRight,
  Bot,
  Info,
  Calendar,
  Clock,
  RotateCcw
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import WorkflowBreadcrumbs from '../components/WorkflowBreadcrumbs';
import LeafletMap from '../components/LeafletMap';
import TimelineBar from '../components/TimelineBar';

const InteractiveMapPage = () => {
  const {
    activeIncident,
    selectedVessel,
    setSelectedVessel,
    vessels,
    triggerChatWithQuestion
  } = useIncident();

  const navigate = useNavigate();
  const primaryVessel = selectedVessel || vessels?.find(v => v.candidateRank === 1) || vessels?.[0];

  return (
    <div className="page-wrapper" style={{ paddingBottom: '2.5rem' }}>
      <WorkflowBreadcrumbs />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Tactical Maritime Map & Timeline Investigation
            </h1>
            <span className="badge badge-simulated">{activeIncident?.id}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '0.2rem' }}>
            Interactive spatiotemporal surveillance: inspect vessel kinematics, slick backward drift, and future forecast envelopes
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => triggerChatWithQuestion(`Explain the trajectory and source region for ${activeIncident?.id}`)}
            className="btn btn-sm btn-cyan-outline"
          >
            <Bot size={14} />
            <span>Ask AI About Map</span>
          </button>
          <button
            onClick={() => navigate('/incident?tab=vessels')}
            className="btn btn-sm btn-primary"
          >
            <span>Candidate Vessels Matrix</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Visual Investigation Unit: Timeline directly ABOVE the Tactical Map ── */}
      <div className="tactical-investigation-unit" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
        {/* 1. Interactive Timeline Playback Bar (ABOVE THE MAP) */}
        <TimelineBar />

        {/* 2. Tactical Map Container (Noticeably Shorter: 480px) */}
        <div className="tactical-map-frame" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <LeafletMap height="480px" mode="tactical" />
        </div>
      </div>

      {/* ── 3. Primary Candidate Vessel Information (BELOW THE MAP) ── */}
      {primaryVessel && (
        <div className="card" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: primaryVessel.color || 'var(--primary)' }}>
                <Ship size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{primaryVessel.name}</h3>
                  <span className="badge badge-simulated">{primaryVessel.candidateTag || 'PRIMARY SUSPECT'}</span>
                  <span className="badge badge-danger">{primaryVessel.correlationScore}% Correlation Score</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
                  Type: <strong>{primaryVessel.shipType}</strong> • MMSI: <strong>{primaryVessel.mmsi}</strong> • Flag: <strong>{primaryVessel.flag}</strong> • Min Source Distance: <strong>{primaryVessel.minSourceDistanceKm || primaryVessel.distanceFromSourceKm} km</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/incident?tab=vessels')}
                className="btn btn-sm btn-cyan-outline"
              >
                Inspect Vessel Details & Anomalies
              </button>
              <button
                onClick={() => navigate('/incident?tab=history')}
                className="btn btn-sm btn-secondary"
              >
                Historical Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMapPage;
