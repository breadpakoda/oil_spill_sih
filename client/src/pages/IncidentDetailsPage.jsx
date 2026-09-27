import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Layers,
  Cpu,
  Compass,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  Play,
  ArrowRight,
  ShieldAlert,
  Info,
  Sliders
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import WorkflowBreadcrumbs from '../components/WorkflowBreadcrumbs';
import SARViewer from '../components/SARViewer';

const IncidentDetailsPage = () => {
  const {
    activeIncident,
    environmentalData,
    hindcastState,
    setHindcastState
  } = useIncident();

  const navigate = useNavigate();

  const [hindcastProgress, setHindcastProgress] = useState(100);
  const [hindcastStepText, setHindcastStepText] = useState('Hindcast Reconstruction Complete');

  const handleRunHindcast = () => {
    setHindcastState('PROCESSING');
    setHindcastProgress(0);
    setHindcastStepText('Loading historical ocean currents & wind vectors (INCOIS-HYCOM)...');

    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      if (p === 40) {
        setHindcastStepText('Reconstructing backward Lagrangian trajectory (500 particles)...');
      } else if (p === 70) {
        setHindcastStepText('Computing dispersion covariance & estimating release window...');
      } else if (p >= 100) {
        clearInterval(interval);
        setHindcastProgress(100);
        setHindcastState('COMPLETED');
        setHindcastStepText('Hindcast Reconstruction Complete');
      }
      setHindcastProgress(Math.min(100, p));
    }, 400);
  };

  if (!activeIncident) return null;

  return (
    <div className="page-wrapper">
      <WorkflowBreadcrumbs />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Simulated SAR Satellite Detection & Spill Characterization
            </h1>
            <span className="badge badge-simulated">{activeIncident.id}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Synthetic Aperture Radar (SAR) dark formation analysis, neural segmentation, and backward trajectory hindcasting
          </p>
        </div>

        <button
          onClick={() => navigate('/map')}
          className="btn btn-primary btn-sm"
        >
          <span>View on Tactical Map</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Section 1: Simulated SAR Detection Pipeline */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SARViewer />
      </div>

      {/* Section 2: Spill Characterization Card & Hindcast Backtracking */}
      <div className="grid-2">
        {/* Spill Characterization Card (Section 11) */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Radio size={18} className="text-cyan" />
              <span>Spill Morphological Characterization</span>
            </div>
            <span className="badge badge-demo">Simulated Features</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Location / Coordinates:</span>
              <strong className="mono">{activeIncident.coordinates?.lat}°N, {activeIncident.coordinates?.lng}°E</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Acquisition Timestamp:</span>
              <span className="mono">{activeIncident.displayDate}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Spill Surface Area:</span>
              <strong className="text-cyan">{activeIncident.spillAreaKm2} km² (Confidence: {activeIncident.confidence}%)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Dimensions (L × W):</span>
              <span>{activeIncident.spillLengthKm} km × {activeIncident.spillWidthKm} km</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shape & Morphology:</span>
              <span>{activeIncident.shape}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Elongation Axis Orientation:</span>
              <span className="mono" style={{ color: '#f59e0b' }}>{activeIncident.orientation}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>SAR Sensor & Swath:</span>
              <span>{activeIncident.sarSatellite} ({activeIncident.sensorMode})</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Est. Volume Decant:</span>
              <strong style={{ color: '#f87171' }}>{activeIncident.estimatedVolumeM3} m³ (~{activeIncident.estimatedBarrels} barrels)</strong>
            </div>
          </div>
        </div>

        {/* Section 14: Hindcast / Backtracking Simulator */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <RotateCcw size={18} className="text-cyan" />
              <span>Hindcast / Backtracking Simulator</span>
            </div>
            <button
              onClick={handleRunHindcast}
              disabled={hindcastState === 'PROCESSING'}
              className="btn btn-sm btn-cyan-outline"
            >
              <Play size={14} />
              <span>Run Hindcast</span>
            </button>
          </div>

          {/* Progress bar during run */}
          {hindcastState === 'PROCESSING' && (
            <div style={{ marginBottom: '1rem', background: 'rgba(0, 240, 255, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-cyan)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                <span>{hindcastStepText}</span>
                <span>{hindcastProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${hindcastProgress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}

          {/* Hindcast Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                ESTIMATED RELEASE WINDOW:
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {activeIncident.probableSourceRegion?.displayWindow}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 240, 255, 0.06)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                PROBABLE SOURCE REGION:
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                Region around {activeIncident.probableSourceRegion?.center?.[0]}°N, {activeIncident.probableSourceRegion?.center?.[1]}°E
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Uncertainty Radius: {(activeIncident.probableSourceRegion?.radiusMeters / 1000).toFixed(1)} km • Source Confidence: <strong style={{ color: '#10b981' }}>{activeIncident.probableSourceRegion?.confidence}%</strong>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              <Info size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: 'var(--text-secondary)' }} />
              <strong>Modeling Methodology:</strong> Reverse Lagrangian particle simulation tracks 500 stochastic particles backward through hourly MetOcean current and wind stress fields. Rather than a single unrealistic point, a probabilistic source region envelope is calculated.
            </div>

            <button
              onClick={() => navigate('/vessels')}
              className="btn btn-sm btn-secondary"
              style={{ marginTop: '0.5rem' }}
            >
              <span>Correlate AIS Vessels in Source Region</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailsPage;
