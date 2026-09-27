import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Map as MapIcon,
  Ship,
  Compass,
  Wind,
  Droplet,
  ArrowRight,
  Bot,
  CheckCircle2
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
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Loading incident data…</p>
      </div>
    );
  }

  const primaryVessel = vessels?.[0];
  const env = environmentalData;

  return (
    <div className="page-wrapper">
      <WorkflowBreadcrumbs />

      {/* ── Page title ── */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Oil Spill Intelligence Dashboard</h1>
          <span className="badge badge-demo">Demo Mode</span>
          <span className="badge badge-simulated">Simulated Data</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          AI-powered maritime surveillance — SAR detection, hydrodynamic hindcasting, AIS correlation
        </p>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card" style={{ '--accent': 'var(--primary)' }}>
          <div className="stat-label">Spill Area</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>
            {activeIncident.spillAreaKm2} <small style={{ fontSize: '1rem', fontWeight: 500 }}>km²</small>
          </div>
          <div className="stat-sub">{activeIncident.spillLengthKm} × {activeIncident.spillWidthKm} km</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Detection Confidence</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{activeIncident.confidence}%</div>
          <div className="stat-sub">U-Net v2.4 · {activeIncident.sarSatellite?.split(' ')[0]}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Primary Candidate</div>
          <div className="stat-value" style={{ fontSize: '1.1rem', color: 'var(--danger)' }}>
            {primaryVessel?.name ?? '—'}
          </div>
          <div className="stat-sub">Score: {primaryVessel?.correlationScore}% · Slowdown anomaly</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Est. Volume</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {activeIncident.estimatedVolumeM3} <small style={{ fontSize: '1rem', fontWeight: 500 }}>m³</small>
          </div>
          <div className="stat-sub">≈ {activeIncident.estimatedBarrels?.toLocaleString()} barrels</div>
        </div>
      </div>

      {/* ── Main two-column layout ── */}
      <div className="grid-main-side" style={{ marginBottom: '1.25rem' }}>
        {/* Left: map */}
        <div className="card" style={{ padding: '0.85rem' }}>
          <div className="card-header">
            <div className="card-title">
              <MapIcon size={16} style={{ color: 'var(--primary)' }} />
              Tactical Map
            </div>
            <button onClick={() => navigate('/map')} className="btn btn-sm btn-cyan-outline">
              Full screen & Timeline <ArrowRight size={13} />
            </button>
          </div>
          <LeafletMap height="400px" />
        </div>

        {/* Right: Incident brief + env */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Incident brief */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Radio size={15} style={{ color: 'var(--primary)' }} />
                Active Incident
              </div>
              <span className="badge badge-danger">{activeIncident.status}</span>
            </div>

            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <Row label="ID" value={<strong className="mono" style={{ color: 'var(--primary)' }}>{activeIncident.id}</strong>} />
              <Row label="Location" value={activeIncident.locationName} />
              <Row label="Detected" value={<span className="mono">{activeIncident.displayDate}</span>} />
              <Row label="Source Region" value={
                <span className="mono" style={{ color: 'var(--warning)' }}>
                  {activeIncident.probableSourceRegion?.center?.join('°, ')}°
                </span>
              } />
              <Row label="Release Window" value={<span className="mono">{activeIncident.probableSourceRegion?.displayWindow}</span>} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
              <button onClick={() => navigate('/incident')} className="btn btn-sm btn-primary" style={{ flex: 1 }}>
                SAR Detection
              </button>
              <button onClick={() => navigate('/vessels')} className="btn btn-sm btn-secondary" style={{ flex: 1 }}>
                Vessels
              </button>
            </div>
          </div>

          {/* Environmental snapshot */}
          {env && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Wind size={15} style={{ color: 'var(--primary)' }} />
                  MetOcean Conditions
                </div>
                <span className="badge badge-simulated">HYCOM / ECMWF</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.8rem' }}>
                <EnvItem label="Wind" value={`${env.wind?.speedKmh} km/h ${env.wind?.directionText}`} />
                <EnvItem label="Current" value={`${env.oceanCurrent?.speedMs} m/s ${env.oceanCurrent?.directionText}`} />
                <EnvItem label="Waves" value={`${env.waves?.heightMeters}m, ${env.waves?.periodSeconds}s`} />
                <EnvItem label="Tide" value={env.tide?.phase} />
                <EnvItem label="SST" value={`${env.seaTemperatureCelsius}°C`} />
                <EnvItem label="Salinity" value={`${env.salinityPsu} PSU`} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row: candidates + incident selector ── */}
      <div className="grid-2">
        {/* Candidate Vessels */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Ship size={15} style={{ color: 'var(--primary)' }} />
              Candidate Vessels ({vessels.length})
            </div>
            <button onClick={() => navigate('/vessels')} className="btn btn-sm btn-secondary">
              Full Analysis
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {vessels.map((v) => (
              <div
                key={v.id}
                onClick={() => navigate('/vessels')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: v.candidateRank === 1 ? '#fff5f5' : 'var(--bg-muted)',
                  border: `1px solid ${v.candidateRank === 1 ? '#fecaca' : 'var(--border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.12s'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: v.candidateRank === 1 ? 'var(--danger)' : 'var(--text-primary)' }}>
                    {v.name}
                  </div>
                  <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)', marginTop: '1px', fontFamily: 'var(--font-mono)' }}>
                    {v.shipType} · {v.minSourceDistanceKm ?? v.distanceFromSourceKm} km from source
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '1rem', color: v.candidateRank === 1 ? 'var(--danger)' : v.correlationScore > 40 ? 'var(--warning)' : 'var(--text-muted)' }}>
                    {v.correlationScore}%
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Selector */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Compass size={15} style={{ color: 'var(--primary)' }} />
              Incident Archive
            </div>
            <span className="badge badge-simulated">{incidents.length} scenarios</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {incidents.map((inc) => {
              const active = inc.id === activeIncidentId;
              return (
                <div
                  key={inc.id}
                  onClick={() => selectIncident(inc.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: active ? 'var(--primary-light)' : 'var(--bg-muted)',
                    border: `1px solid ${active ? '#bfdbfe' : 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.12s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="mono" style={{ fontWeight: 700, fontSize: '0.82rem', color: active ? 'var(--primary)' : 'var(--text-primary)' }}>
                        {inc.id}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{inc.title}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                      {inc.locationName.split('(')[0].trim()} · {inc.spillAreaKm2} km²
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${inc.status.includes('Active') ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.62rem' }}>
                      {inc.status}
                    </span>
                    {active && <CheckCircle2 size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />}
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

/* ── small helpers ── */
const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
    <span style={{ textAlign: 'right' }}>{value}</span>
  </div>
);

const EnvItem = ({ label, value }) => (
  <div style={{ background: 'var(--bg-muted)', padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>{label}</div>
    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
  </div>
);

export default DashboardPage;
