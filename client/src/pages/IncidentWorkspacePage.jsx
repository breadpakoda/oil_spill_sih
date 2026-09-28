import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Radio,
  Map as MapIcon,
  Ship,
  History,
  Compass,
  FileCheck2,
  LayoutDashboard,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowRight,
  Wind,
  Droplet,
  Bot,
  Activity,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

// Investigation Sub-Views
import SARViewer from '../components/SARViewer';
import LeafletMap from '../components/LeafletMap';
import TimelineBar from '../components/TimelineBar';
import VesselAnalysisPage from './VesselAnalysisPage';
import HistoricalIntelligencePage from './HistoricalIntelligencePage';
import ForecastPage from './ForecastPage';
import EvidenceReportPage from './EvidenceReportPage';
import IncidentDetailsPage from './IncidentDetailsPage';
import InteractiveMapPage from './InteractiveMapPage';

const IncidentWorkspacePage = () => {
  const {
    activeIncident,
    incidents,
    activeIncidentId,
    selectIncident,
    environmentalData,
    vessels,
    forecast,
    selectedVessel,
    setSelectedVessel,
    triggerChatWithQuestion,
    hindcastState,
    setHindcastState
  } = useIncident();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state synced with URL search parameter
  const tabParam = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    const currentTab = searchParams.get('tab') || 'overview';
    setActiveTab(currentTab);
  }, [searchParams]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  if (!activeIncident) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Loading incident workspace…</p>
      </div>
    );
  }

  const primaryVessel = vessels?.[0];
  const env = environmentalData;

  const workspaceTabs = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'sar', label: 'SAR Detection', icon: Radio },
    { key: 'map', label: 'Tactical Map', icon: MapIcon },
    { key: 'vessels', label: 'Vessel Correlation', icon: Ship },
    { key: 'history', label: 'Historical Intelligence', icon: History },
    { key: 'forecast', label: 'Forecast', icon: Compass },
    { key: 'report', label: 'Evidence & Report', icon: FileCheck2 },
  ];

  return (
    <div className="incident-workspace-container">
      {/* ── 1. Incident Workspace Header (Section 9) ── */}
      <div className="workspace-header">
        <div className="workspace-header-top">
          <button
            onClick={() => navigate('/')}
            className="workspace-back-btn"
            title="Return to Maritime Overview Monitoring"
          >
            <ArrowLeft size={14} />
            <span>Back to Overview</span>
          </button>

          {/* Quick Incident Switcher */}
          <div className="workspace-case-selector">
            <span className="case-label">CASE:</span>
            <select
              value={activeIncidentId}
              onChange={(e) => selectIncident(e.target.value)}
              className="workspace-case-dropdown mono"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} • {inc.locationName.split('(')[0].trim()}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="case-chevron" />
          </div>
        </div>

        <div className="workspace-title-row">
          <div>
            <div className="workspace-title-badge-group">
              <h1 className="workspace-main-title">
                {activeIncident.id} — {activeIncident.title}
              </h1>
              <span className="workspace-status-badge">
                <span className="status-dot" />
                {activeIncident.status || 'INVESTIGATION ACTIVE'}
              </span>
            </div>

            <div className="workspace-meta-line">
              <span className="meta-item">
                <Clock size={12} />
                {activeIncident.displayDate || '27 Sep 2026 • 14:32 UTC'}
              </span>
              <span className="meta-bullet">•</span>
              <span className="meta-item">
                <MapPin size={12} />
                {activeIncident.locationName}
              </span>
              <span className="meta-bullet">•</span>
              <span className="meta-item mono text-cyan">
                {activeIncident.coordinates?.lat?.toFixed(3)}° N, {activeIncident.coordinates?.lng?.toFixed(3)}° E
              </span>
            </div>
          </div>

          <div className="workspace-header-actions">
            <button
              onClick={() => triggerChatWithQuestion(`Provide an executive investigation summary for ${activeIncident.id}`)}
              className="btn btn-sm btn-cyan-outline"
            >
              <Bot size={14} />
              <span>Ask AI About Case</span>
            </button>
          </div>
        </div>

        {/* ── 2. Secondary Incident-Specific Navigation (Section 8) ── */}
        <div className="workspace-tabs-bar">
          {workspaceTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`workspace-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Incident Workspace Content Area ── */}
      <div className="workspace-content-body">
        {/* TAB 1: INCIDENT OVERVIEW (Section 10) */}
        {activeTab === 'overview' && (
          <div className="page-wrapper" style={{ paddingTop: '1.25rem' }}>
            {/* Concise Structured Summary Grid */}
            <div className="grid-main-side" style={{ marginBottom: '1.5rem' }}>
              {/* Left: Key Parameters Spec Sheet */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <ShieldAlert size={16} className="text-cyan" />
                    <span>Incident Operational Specification ({activeIncident.id})</span>
                  </div>
                  <span className="badge badge-danger">{activeIncident.status}</span>
                </div>

                <div className="incident-spec-grid">
                  <div className="spec-row">
                    <span className="spec-label">Detection:</span>
                    <span className="spec-value">
                      Oil spill detected from simulated SAR imagery ({activeIncident.sarSatellite})
                    </span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">Location:</span>
                    <span className="spec-value mono">
                      {activeIncident.coordinates?.lat?.toFixed(3)}° N, {activeIncident.coordinates?.lng?.toFixed(3)}° E ({activeIncident.locationName})
                    </span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">Detected:</span>
                    <span className="spec-value mono font-bold">
                      {activeIncident.displayDate}
                    </span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">Spill Area:</span>
                    <span className="spec-value text-primary font-mono font-bold">
                      {activeIncident.spillAreaKm2} km² ({activeIncident.spillLengthKm} × {activeIncident.spillWidthKm} km)
                    </span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">Detection Confidence:</span>
                    <span className="spec-value text-success font-mono font-bold">
                      {activeIncident.confidence}% (Deep Learning U-Net v2.4 segmentation)
                    </span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">Estimated Volume:</span>
                    <span className="spec-value text-warning font-mono font-bold">
                      {activeIncident.estimatedVolumeM3} m³ (≈ {activeIncident.estimatedBarrels?.toLocaleString()} barrels)
                    </span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">Probable Source Region:</span>
                    <span className="spec-value">
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Available</span>
                      <span className="mono" style={{ marginLeft: '6px' }}>
                        Centroid {activeIncident.probableSourceRegion?.center?.join('°, ')}° ({activeIncident.probableSourceRegion?.confidence}% Conf.)
                      </span>
                    </span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">Candidate Vessels:</span>
                    <span className="spec-value">
                      <strong className="text-danger">{vessels.length} vessels of interest</strong>
                      {primaryVessel && (
                        <span className="mono text-muted" style={{ marginLeft: '6px' }}>
                          (Primary: {primaryVessel.name} — Score: {primaryVessel.correlationScore}%)
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">Forecast:</span>
                    <span className="spec-value">
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Available</span>
                      <span style={{ marginLeft: '6px' }}>
                        Hydrodynamic drift simulation ready (+24h horizon, {forecast?.overallConfidencePercent || 87}% confidence)
                      </span>
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons (Section 10) */}
                <div className="overview-action-jump-grid">
                  <button
                    onClick={() => handleTabChange('map')}
                    className="btn-action-jump"
                  >
                    <MapIcon size={15} />
                    <span>VIEW TACTICAL MAP</span>
                    <ArrowRight size={13} className="jump-arrow" />
                  </button>

                  <button
                    onClick={() => handleTabChange('vessels')}
                    className="btn-action-jump"
                  >
                    <Ship size={15} />
                    <span>VIEW VESSELS</span>
                    <ArrowRight size={13} className="jump-arrow" />
                  </button>

                  <button
                    onClick={() => handleTabChange('forecast')}
                    className="btn-action-jump"
                  >
                    <Compass size={15} />
                    <span>VIEW FORECAST</span>
                    <ArrowRight size={13} className="jump-arrow" />
                  </button>

                  <button
                    onClick={() => handleTabChange('report')}
                    className="btn-action-jump"
                  >
                    <FileCheck2 size={15} />
                    <span>VIEW EVIDENCE</span>
                    <ArrowRight size={13} className="jump-arrow" />
                  </button>
                </div>
              </div>

              {/* Right: MetOcean Snapshot & Mini Map */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Environmental Snapshot */}
                {env && (
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">
                        <Wind size={15} className="text-cyan" />
                        <span>MetOcean Conditions at Detection</span>
                      </div>
                      <span className="badge badge-simulated">HYCOM / ECMWF</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.8rem' }}>
                      <EnvItem label="Wind Speed" value={`${env.wind?.speedKmh} km/h ${env.wind?.directionText}`} />
                      <EnvItem label="Ocean Current" value={`${env.oceanCurrent?.speedMs} m/s ${env.oceanCurrent?.directionText}`} />
                      <EnvItem label="Waves" value={`${env.waves?.heightMeters}m, ${env.waves?.periodSeconds}s`} />
                      <EnvItem label="Tide Phase" value={env.tide?.phase} />
                      <EnvItem label="Sea Temp (SST)" value={`${env.seaTemperatureCelsius}°C`} />
                      <EnvItem label="Salinity" value={`${env.salinityPsu} PSU`} />
                    </div>
                  </div>
                )}

                {/* Candidate Vessels Quick Card */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">
                      <Ship size={15} className="text-cyan" />
                      <span>Candidate Vessels of Interest ({vessels.length})</span>
                    </div>
                    <button onClick={() => handleTabChange('vessels')} className="btn btn-xs btn-cyan-outline">
                      Full Matrix
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {vessels.slice(0, 3).map((v) => (
                      <div
                        key={v.id}
                        onClick={() => {
                          setSelectedVessel(v);
                          handleTabChange('vessels');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          background: v.candidateRank === 1 ? '#fff5f5' : 'var(--bg-muted)',
                          border: `1px solid ${v.candidateRank === 1 ? '#fecaca' : 'var(--border)'}`,
                          cursor: 'pointer'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: v.candidateRank === 1 ? 'var(--danger)' : 'var(--text-primary)' }}>
                            {v.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {v.shipType} • {v.minSourceDistanceKm || v.distanceFromSourceKm} km from source
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="mono font-bold" style={{ color: v.candidateRank === 1 ? 'var(--danger)' : 'var(--primary)', fontSize: '0.9rem' }}>
                            {v.correlationScore}%
                          </span>
                          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAR DETECTION & SPILL CHARACTERIZATION (Section 11) */}
        {activeTab === 'sar' && (
          <IncidentDetailsPage />
        )}

        {/* TAB 3: TACTICAL MAP & TIMELINE (Section 12) */}
        {activeTab === 'map' && (
          <InteractiveMapPage />
        )}

        {/* TAB 4: AIS VESSEL CORRELATION (Section 13) */}
        {activeTab === 'vessels' && (
          <VesselAnalysisPage />
        )}

        {/* TAB 5: HISTORICAL INTELLIGENCE (Section 14) */}
        {activeTab === 'history' && (
          <HistoricalIntelligencePage />
        )}

        {/* TAB 6: SPILL DRIFT FORECAST (Section 15) */}
        {activeTab === 'forecast' && (
          <ForecastPage />
        )}

        {/* TAB 7: EVIDENCE & INVESTIGATION REPORT (Section 16) */}
        {activeTab === 'report' && (
          <EvidenceReportPage />
        )}
      </div>
    </div>
  );
};

const EnvItem = ({ label, value }) => (
  <div style={{ background: 'var(--bg-muted)', padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
    <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>
      {label}
    </div>
    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
  </div>
);

export default IncidentWorkspacePage;
