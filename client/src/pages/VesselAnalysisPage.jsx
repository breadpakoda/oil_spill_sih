import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ship,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Clock,
  Compass,
  Activity,
  Bot,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  History
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import WorkflowBreadcrumbs from '../components/WorkflowBreadcrumbs';

const VesselAnalysisPage = () => {
  const {
    activeIncident,
    vessels,
    selectedVessel,
    setSelectedVessel,
    triggerChatWithQuestion
  } = useIncident();

  const navigate = useNavigate();

  if (!activeIncident || !vessels || vessels.length === 0) return null;

  const currentVessel = selectedVessel || vessels[0];

  return (
    <div className="page-wrapper">
      <WorkflowBreadcrumbs />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              AIS Vessel Correlation & Kinematic Analysis
            </h1>
            <span className="badge badge-simulated">{activeIncident.id}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Spatiotemporal intersection between reconstructed source region and historical vessel AIS trajectories
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => triggerChatWithQuestion(`Why was ${currentVessel.name} considered a candidate?`)}
            className="btn btn-sm btn-cyan-outline"
          >
            <Bot size={14} />
            <span>Ask AI: Why {currentVessel.name}?</span>
          </button>
          <button
            onClick={() => navigate('/history')}
            className="btn btn-sm btn-secondary"
          >
            <History size={14} />
            <span>Vessel History</span>
          </button>
        </div>
      </div>

      {/* Legal & Simulation Notice */}
      <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: '#fbbf24' }}>
        <AlertTriangle size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>PROTOTYPE SIMULATION NOTICE:</strong> Correlation scores represent simulated statistical congruence (spatial proximity, temporal overlap, kinematic alignment, and telemetry anomalies). These scores provide operational leads for maritime authorities and do not constitute formal legal findings or proof of liability.
        </div>
      </div>

      {/* Main Grid: Left Candidate Vessels List, Right Selected Vessel In-depth Dossier */}
      <div className="grid-main-side">
        {/* Left Side: Candidate Vessels List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Ship size={18} className="text-cyan" />
                <span>Candidate Vessels in Search Window ({vessels.length})</span>
              </div>
              <span className="badge badge-demo">Simulated AIS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {vessels.map((vessel) => {
                const isSelected = currentVessel.id === vessel.id;
                const isPrimary = vessel.candidateRank === 1;

                return (
                  <div
                    key={vessel.id}
                    onClick={() => setSelectedVessel(vessel)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected
                        ? 'rgba(0, 240, 255, 0.09)'
                        : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'var(--border-cyan)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: vessel.color || '#3b82f6', display: 'inline-block' }} />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isPrimary ? '#f87171' : 'var(--text-primary)' }}>
                          {vessel.name}
                        </h4>
                        <span className="badge badge-simulated" style={{ fontSize: '0.65rem' }}>
                          {vessel.candidateTag}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.1rem', color: isPrimary ? '#ef4444' : (vessel.correlationScore > 40 ? '#f59e0b' : '#3b82f6') }}>
                          {vessel.correlationScore}%
                        </span>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Correlation Score
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Min Distance:</span>{' '}
                        <strong>{vessel.minSourceDistanceKm || vessel.distanceFromSourceKm} km</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Time Overlap:</span>{' '}
                        <span>{vessel.timeOverlap.split('(')[0].trim()}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Trajectory:</span>{' '}
                        <span style={{ color: vessel.trajectoryCompatibility === 'High' ? '#10b981' : 'inherit' }}>
                          {vessel.trajectoryCompatibility}
                        </span>
                      </div>
                    </div>

                    {vessel.behavioralAnomaly && vessel.behavioralAnomaly !== 'None' && (
                      <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.6rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '4px', fontSize: '0.72rem', color: '#fca5a5' }}>
                        <strong>Behavioral Anomaly:</strong> {vessel.behavioralAnomaly}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Selected Vessel Deep Dive Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Detailed Vessel Dossier */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Ship size={18} style={{ color: currentVessel.color || 'var(--primary)' }} />
                <span>Vessel Specification: {currentVessel.name}</span>
              </div>
              <span className="badge badge-danger">
                {currentVessel.correlationScore}% Correlation
              </span>
            </div>

            {/* Vessel Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>MMSI:</span>{' '}
                <strong className="mono">{currentVessel.mmsi}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>IMO Number:</span>{' '}
                <strong className="mono">{currentVessel.imo}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Ship Type:</span>{' '}
                <span>{currentVessel.shipType}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Flag State:</span>{' '}
                <span>{currentVessel.flag}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Length / Beam:</span>{' '}
                <span>{currentVessel.length}m × {currentVessel.beam}m</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Draught:</span>{' '}
                <span>{currentVessel.draught}m</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Deadweight:</span>{' '}
                <span>{currentVessel.dwt?.toLocaleString()} DWT</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Destination:</span>{' '}
                <span>{currentVessel.destination || 'In Transit'}</span>
              </div>
            </div>

            {/* Section 17: Transparent Evidence Breakdown Checklist */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Evidence Breakdown Criteria:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  {currentVessel.evidenceBreakdown?.spatialProximity?.matched ? (
                    <CheckCircle2 size={16} className="text-success" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <XCircle size={16} style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <strong style={{ color: currentVessel.evidenceBreakdown?.spatialProximity?.matched ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      Spatial Proximity:
                    </strong>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {currentVessel.evidenceBreakdown?.spatialProximity?.detail}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  {currentVessel.evidenceBreakdown?.temporalOverlap?.matched ? (
                    <CheckCircle2 size={16} className="text-success" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <XCircle size={16} style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <strong style={{ color: currentVessel.evidenceBreakdown?.temporalOverlap?.matched ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      Temporal Overlap:
                    </strong>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {currentVessel.evidenceBreakdown?.temporalOverlap?.detail}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  {currentVessel.evidenceBreakdown?.trajectoryConsistency?.matched ? (
                    <CheckCircle2 size={16} className="text-success" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <XCircle size={16} style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <strong style={{ color: currentVessel.evidenceBreakdown?.trajectoryConsistency?.matched ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      Trajectory Consistency:
                    </strong>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {currentVessel.evidenceBreakdown?.trajectoryConsistency?.detail}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  {currentVessel.evidenceBreakdown?.behaviorAnomaly?.matched ? (
                    <CheckCircle2 size={16} className="text-danger" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <XCircle size={16} style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <strong style={{ color: currentVessel.evidenceBreakdown?.behaviorAnomaly?.matched ? '#f87171' : 'var(--text-muted)' }}>
                      Behavioral Anomaly:
                    </strong>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {currentVessel.evidenceBreakdown?.behaviorAnomaly?.detail}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Behavioral Anomaly Event Log */}
            {currentVessel.anomalies && currentVessel.anomalies.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f87171' }}>
                  Logged Kinematic Anomalies ({currentVessel.anomalies.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {currentVessel.anomalies.map((anom, idx) => (
                    <div key={idx} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '4px', padding: '0.45rem 0.65rem', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        <span>{anom.type}</span>
                        <span>{anom.time}</span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {anom.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => navigate('/history')}
                className="btn btn-sm btn-primary"
                style={{ flex: 1 }}
              >
                Inspect Historical Records
              </button>
              <button
                onClick={() => navigate('/map')}
                className="btn btn-sm btn-secondary"
                style={{ flex: 1 }}
              >
                Track on Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VesselAnalysisPage;
