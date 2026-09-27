import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Flame,
  Radio,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Ship,
  Wind,
  Compass,
  AlertTriangle,
  Activity,
  Bot,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import WorkflowBreadcrumbs from '../components/WorkflowBreadcrumbs';
import LeafletMap from '../components/LeafletMap';

const DashboardPage = () => {
  const {
    incidents,
    activeIncidentId,
    activeIncident,
    environmentalData,
    vessels,
    selectIncident,
    triggerChatWithQuestion
  } = useIncident();

  const navigate = useNavigate();

  if (!activeIncident) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
          Loading Maritime Incident Telemetry...
        </div>
      </div>
    );
  }

  const primaryVessel = vessels && vessels.length > 0 ? vessels[0] : null;

  return (
    <div className="page-wrapper">
      {/* Workflow Stepper */}
      <WorkflowBreadcrumbs />

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>
              Maritime Oil Spill Operational Dashboard
            </h1>
            <span className="badge badge-demo">Demo Mode</span>
            <span className="badge badge-simulated">Simulated Data</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Multi-sensor SAR satellite detection, hydrodynamic hindcasting, and historical AIS correlation suite
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/report')}
            className="btn btn-secondary btn-sm"
          >
            Investigation Dossier
          </button>
          <button
            onClick={() => triggerChatWithQuestion(`Summarize incident ${activeIncident.id}`)}
            className="btn btn-cyan-outline btn-sm"
          >
            <Bot size={14} />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-label">DETECTED SPILL AREA</div>
          <div className="stat-value text-cyan">
            {activeIncident.spillAreaKm2} <span style={{ fontSize: '1rem' }}>km²</span>
          </div>
          <div className="stat-sub">
            Dimensions: {activeIncident.spillLengthKm} × {activeIncident.spillWidthKm} km
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">DETECTION CONFIDENCE</div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {activeIncident.confidence}%
          </div>
          <div className="stat-sub">
            Sensor: {activeIncident.sarSatellite?.split(' ')[0]} (VV Co-pol)
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">PRIMARY CANDIDATE VESSEL</div>
          <div className="stat-value text-danger" style={{ fontSize: '1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {primaryVessel ? primaryVessel.name : 'Analyzing...'}
          </div>
          <div className="stat-sub">
            Correlation Score: <strong>{primaryVessel ? `${primaryVessel.correlationScore}%` : 'N/A'}</strong> (Slowdown Anomaly)
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">ESTIMATED OIL VOLUME</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {activeIncident.estimatedVolumeM3} <span style={{ fontSize: '1rem' }}>m³</span>
          </div>
          <div className="stat-sub">
            Approx. {activeIncident.estimatedBarrels?.toLocaleString()} barrels
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map Preview + Side Intelligence Panels */}
      <div className="grid-main-side" style={{ marginBottom: '1.5rem' }}>
        {/* Map Panel */}
        <div className="card" style={{ padding: '0.85rem' }}>
          <div className="card-header" style={{ marginBottom: '0.75rem' }}>
            <div className="card-title">
              <Activity size={18} className="text-cyan" />
              <span>Live Tactical Map & Correlation Overview</span>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="btn btn-sm btn-cyan-outline"
            >
              <span>Full Screen & Timeline</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <LeafletMap height="460px" />
        </div>

        {/* Right Side: Incident Brief & Environmental Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Active Incident Summary Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Radio size={16} className="text-cyan" />
                <span>Incident Briefing</span>
              </div>
              <span className="badge badge-danger">{activeIncident.status}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Incident ID:</span>{' '}
                <strong className="mono text-cyan">{activeIncident.id}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Location:</span>{' '}
                <strong>{activeIncident.locationName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Detection Time:</span>{' '}
                <span className="mono">{activeIncident.displayDate}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Probable Source:</span>{' '}
                <span className="mono" style={{ color: '#f59e0b' }}>
                  {activeIncident.probableSourceRegion?.center?.join('°, ')}°
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Release Window:</span>{' '}
                <span className="mono">{activeIncident.probableSourceRegion?.displayWindow}</span>
              </div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => navigate('/incident')}
                className="btn btn-sm btn-primary"
                style={{ flex: 1 }}
              >
                Inspect SAR Slick
              </button>
              <button
                onClick={() => navigate('/vessels')}
                className="btn btn-sm btn-secondary"
                style={{ flex: 1 }}
              >
                Inspect Vessels
              </button>
            </div>
          </div>

          {/* Environmental Conditions Card */}
          {environmentalData && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Wind size={16} className="text-cyan" />
                  <span>MetOcean Conditions</span>
                </div>
                <span className="badge badge-simulated">HYCOM / ECMWF</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', fontSize: '0.8rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '4px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>WIND VECTOR</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {environmentalData.wind?.speedKmh} km/h {environmentalData.wind?.directionText}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    Gust: {environmentalData.wind?.gustKmh} km/h
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '4px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>OCEAN CURRENT</div>
                  <div style={{ fontWeight: 700, color: '#34d399' }}>
                    {environmentalData.oceanCurrent?.speedMs} m/s ({environmentalData.oceanCurrent?.speedKnots} kn)
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    Heading: {environmentalData.oceanCurrent?.directionText}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '4px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>SIGNIFICANT WAVES</div>
                  <div style={{ fontWeight: 700, color: '#60a5fa' }}>
                    {environmentalData.waves?.heightMeters} m ({environmentalData.waves?.periodSeconds}s)
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    {environmentalData.waves?.seaState}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '4px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>TIDAL PHASE</div>
                  <div style={{ fontWeight: 700, color: '#fbbf24' }}>
                    {environmentalData.tide?.phase}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    Level: {environmentalData.tide?.levelMeters}m
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Vessels Leaderboard & Incident Switcher Section */}
      <div className="grid-2">
        {/* Candidate Vessels Ranked */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Ship size={18} className="text-cyan" />
              <span>Candidate Vessels of Interest ({vessels.length})</span>
            </div>
            <button
              onClick={() => navigate('/vessels')}
              className="btn btn-sm btn-secondary"
            >
              Detailed Matrix
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {vessels.map((vessel) => (
              <div
                key={vessel.id}
                onClick={() => navigate('/vessels')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${vessel.candidateRank === 1 ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '0.88rem', color: vessel.candidateRank === 1 ? '#f87171' : 'var(--text-primary)' }}>
                      {vessel.name}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      ({vessel.shipType})
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                    Min Dist: <strong>{vessel.minSourceDistanceKm || vessel.distanceFromSourceKm} km</strong> • Overlap: {vessel.timeOverlap.split('(')[0].trim()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem', color: vessel.candidateRank === 1 ? '#ef4444' : (vessel.correlationScore > 40 ? '#f59e0b' : '#3b82f6') }}>
                    {vessel.correlationScore}%
                  </div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Score
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Case Switcher */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={18} className="text-cyan" />
              <span>Simulated Incident Archive ({incidents.length})</span>
            </div>
            <span className="badge badge-simulated">Switch Scenario</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {incidents.map((inc) => {
              const isSelected = inc.id === activeIncidentId;
              return (
                <div
                  key={inc.id}
                  onClick={() => selectIncident(inc.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? 'var(--border-cyan)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong className="mono" style={{ color: isSelected ? 'var(--primary)' : 'var(--text-primary)', fontSize: '0.85rem' }}>
                        {inc.id}
                      </strong>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                        {inc.title}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {inc.locationName} • Area: {inc.spillAreaKm2} km²
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${inc.status.includes('Active') ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                      {inc.status}
                    </span>
                    {isSelected && <CheckCircle2 size={16} className="text-cyan" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
