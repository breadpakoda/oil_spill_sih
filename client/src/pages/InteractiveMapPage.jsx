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

  return (
    <div className="page-wrapper" style={{ paddingBottom: '2rem' }}>
      <WorkflowBreadcrumbs />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Tactical Maritime Map & Timeline Investigation
            </h1>
            <span className="badge badge-simulated">{activeIncident?.id}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
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
            onClick={() => navigate('/vessels')}
            className="btn btn-sm btn-primary"
          >
            <span>Candidate Vessels Matrix</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div style={{ marginBottom: '1rem' }}>
        <LeafletMap height="600px" />
      </div>

      {/* Interactive Timeline Playback Bar */}
      <TimelineBar />

      {/* Selected Vessel Telemetry Quick Bar below map */}
      {selectedVessel && (
        <div className="card" style={{ marginTop: '1.25rem', background: 'rgba(15, 28, 52, 0.85)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 240, 255, 0.12)', border: '1px solid var(--border-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedVessel.color || 'var(--primary)' }}>
                <Ship size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedVessel.name}</h3>
                  <span className="badge badge-simulated">{selectedVessel.candidateTag}</span>
                  <span className="badge badge-danger">{selectedVessel.correlationScore}% Correlation Score</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  Type: {selectedVessel.shipType} • MMSI: {selectedVessel.mmsi} • Flag: {selectedVessel.flag} • Min Source Distance: <strong>{selectedVessel.minSourceDistanceKm || selectedVessel.distanceFromSourceKm} km</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/vessels')}
                className="btn btn-sm btn-cyan-outline"
              >
                Inspect Vessel Details & Anomalies
              </button>
              <button
                onClick={() => navigate('/history')}
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
