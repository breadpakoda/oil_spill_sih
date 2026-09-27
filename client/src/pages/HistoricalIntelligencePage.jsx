import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  ShieldAlert,
  AlertTriangle,
  Ship,
  FileText,
  CheckCircle2,
  Calendar,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import WorkflowBreadcrumbs from '../components/WorkflowBreadcrumbs';

const HistoricalIntelligencePage = () => {
  const {
    activeIncident,
    vessels,
    vesselHistory,
    selectedVessel,
    setSelectedVessel,
    triggerChatWithQuestion
  } = useIncident();

  const navigate = useNavigate();

  const [activeTabVesselId, setActiveTabVesselId] = useState(
    selectedVessel?.id || 'vessel-001'
  );

  const currentRecord = vesselHistory?.find(h => h.vesselId === activeTabVesselId) || vesselHistory?.[0];
  const vesselMeta = vessels?.find(v => v.id === activeTabVesselId) || vessels?.[0];

  return (
    <div className="page-wrapper">
      <WorkflowBreadcrumbs />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Historical Vessel Intelligence & Compliance Registry
            </h1>
            <span className="badge badge-simulated">Port State Control Archive</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Historical MARPOL Annex I compliance records, past pollution advisories, and risk tier ratings
          </p>
        </div>

        <button
          onClick={() => triggerChatWithQuestion(`Show historical records for ${vesselMeta?.name}`)}
          className="btn btn-sm btn-cyan-outline"
        >
          <Bot size={14} />
          <span>Ask AI About {vesselMeta?.name}</span>
        </button>
      </div>

      {/* Mandatory Disclaimer (Section 18) */}
      <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: '#fca5a5' }}>
        <AlertTriangle size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>REGULATORY DISCLAIMER:</strong> Historical records provide contextual information only and do not establish responsibility for the current incident. All past incidents and Port State Control citations listed below are synthetic mock data generated for prototype demonstration.
        </div>
      </div>

      {/* Vessel Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {vessels?.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveTabVesselId(v.id)}
            className={`btn btn-sm ${activeTabVesselId === v.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flexShrink: 0 }}
          >
            <Ship size={14} />
            <span>{v.name}</span>
            {v.candidateRank === 1 && (
              <span className="badge badge-danger" style={{ fontSize: '0.65rem', padding: '1px 4px' }}>
                Primary
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Vessel History Dossier */}
      {currentRecord && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile & Risk Score Overview */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Ship size={18} className="text-cyan" />
                <span>Vessel Background: {currentRecord.name}</span>
              </div>
              <span className="badge badge-warning">
                {currentRecord.riskRating}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div className="stat-card" style={{ padding: '0.75rem 1rem' }}>
                <div className="stat-label">RECORDED DEFICIENCIES</div>
                <div className="stat-value" style={{ fontSize: '1.3rem', color: currentRecord.complianceSummary?.deficienciesCount > 0 ? '#f59e0b' : '#10b981' }}>
                  {currentRecord.complianceSummary?.deficienciesCount}
                </div>
                <div className="stat-sub">Across {currentRecord.complianceSummary?.pscInspectionsRecorded} PSC inspections</div>
              </div>

              <div className="stat-card" style={{ padding: '0.75rem 1rem' }}>
                <div className="stat-label">PAST SIMULATED SPILLS</div>
                <div className="stat-value" style={{ fontSize: '1.3rem', color: currentRecord.complianceSummary?.totalPastIncidents > 0 ? '#ef4444' : '#10b981' }}>
                  {currentRecord.complianceSummary?.totalPastIncidents}
                </div>
                <div className="stat-sub">Simulated registry log</div>
              </div>

              <div className="stat-card" style={{ padding: '0.75rem 1rem' }}>
                <div className="stat-label">OPERATOR ENTITY</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {currentRecord.operator}
                </div>
                <div className="stat-sub">Owner: {currentRecord.registeredOwner || 'Private Holding'}</div>
              </div>

              <div className="stat-card" style={{ padding: '0.75rem 1rem' }}>
                <div className="stat-label">FLAG STATE / CLASS</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {currentRecord.flag}
                </div>
                <div className="stat-sub">Class: {currentRecord.classificationSociety || 'IACS Member'}</div>
              </div>
            </div>
          </div>

          {/* Historical Incidents / Inspection Log */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <FileText size={18} className="text-cyan" />
                <span>Simulated Historical Incidents & Inspections Log</span>
              </div>
              <span className="badge badge-demo">Simulated Records</span>
            </div>

            {currentRecord.incidents && currentRecord.incidents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {currentRecord.incidents.map((hist) => (
                  <div
                    key={hist.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="mono" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem' }}>
                          {hist.id}
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {hist.incidentType}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span className={`badge ${hist.severity === 'Moderate' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                          {hist.severity} Severity
                        </span>
                        <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                          {hist.status}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} />
                        <span>{hist.date} ({hist.year})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} />
                        <span>{hist.location}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      <strong>Inspection Findings:</strong> {hist.description}
                    </div>

                    <div style={{ fontSize: '0.8rem', background: 'rgba(0, 240, 255, 0.05)', padding: '0.45rem 0.75rem', borderRadius: '4px', borderLeft: '3px solid var(--primary)', color: 'var(--text-primary)' }}>
                      <strong>Investigation Outcome:</strong> {hist.investigationOutcome}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={36} className="text-success" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  Clean Compliance Record
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  No prior pollution citations or detention orders logged in simulated port state database.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalIntelligencePage;
