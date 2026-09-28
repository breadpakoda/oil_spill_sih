import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Flame,
  Radio,
  MapPin,
  Clock,
  Compass,
  Ship,
  Sparkles
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

const SpillDetailsPage = () => {
  const { activeIncident } = useIncident();
  const navigate = useNavigate();

  if (!activeIncident) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Loading incident telemetry…</p>
        <button onClick={() => navigate('/')} className="btn btn-sm btn-secondary" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={14} /> Back to Map
        </button>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.75rem 2rem 3rem' }}>
      {/* ── Top Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button
          onClick={() => navigate('/')}
          className="btn btn-sm btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
        >
          <ArrowLeft size={15} />
          Back to Command Map
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-demo">Incident File</span>
          <span className="badge badge-simulated">{activeIncident.id}</span>
        </div>
      </div>

      {/* ── Header Title Card ── */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem 1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-danger badge-pulse" style={{ fontSize: '0.72rem' }}>
                <Flame size={12} />
                {activeIncident.status}
              </span>
              <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                {activeIncident.id}
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111827', marginBottom: '0.35rem' }}>
              {activeIncident.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} style={{ color: '#ea4335' }} />
                {activeIncident.locationName}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                <Clock size={14} style={{ color: 'var(--primary)' }} />
                {activeIncident.displayDate}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Compass size={14} style={{ color: 'var(--warning)' }} />
                Coordinates: <strong className="mono">{activeIncident.coordinates?.lat}°N, {activeIncident.coordinates?.lng}°E</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => navigate('/incident')} className="btn btn-sm btn-cyan-outline">
              <Radio size={14} /> Full SAR Analysis
            </button>
            <button onClick={() => navigate('/vessels')} className="btn btn-sm btn-primary">
              <Ship size={14} /> Vessel Attribution
            </button>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Overview Grid ── */}
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card">
          <div className="stat-label">Spill Area</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>
            {activeIncident.spillAreaKm2} <small style={{ fontSize: '1rem', fontWeight: 500 }}>km²</small>
          </div>
          <div className="stat-sub">{activeIncident.spillLengthKm} km × {activeIncident.spillWidthKm} km extent</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Detection Confidence</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {activeIncident.confidence}%
          </div>
          <div className="stat-sub">{activeIncident.sarSatellite}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Estimated Volume</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {activeIncident.estimatedVolumeM3} <small style={{ fontSize: '1rem', fontWeight: 500 }}>m³</small>
          </div>
          <div className="stat-sub">≈ {activeIncident.estimatedBarrels?.toLocaleString()} bbls</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Primary Suspect</div>
          <div className="stat-value" style={{ fontSize: '1.15rem', color: 'var(--danger)' }}>
            {activeIncident.primaryCandidate || 'MV Ocean Star'}
          </div>
          <div className="stat-sub">{activeIncident.candidateCount || 4} candidate vessels identified</div>
        </div>
      </div>

      {/* ── Designated Custom Content Container ── */}
      <div className="card" style={{
        background: '#ffffff',
        border: '2px dashed #bfdbfe',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
        }}>
          <Sparkles size={28} />
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.45rem' }}>
          Dedicated Incident File for {activeIncident.id}
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#6b7280', maxWidth: '650px', margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
          Viewing <strong>"{activeIncident.title}"</strong>. This workspace is directly connected to the active incident and ready for custom operational modules.
        </p>
      </div>
    </div>
  );
};

export default SpillDetailsPage;
