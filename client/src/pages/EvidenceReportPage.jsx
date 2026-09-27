import React from 'react';
import {
  FileText,
  Printer,
  ShieldCheck,
  Download,
  AlertTriangle,
  Radio,
  Wind,
  Compass,
  Ship,
  History,
  CheckCircle2,
  Calendar,
  MapPin,
  Bot
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import WorkflowBreadcrumbs from '../components/WorkflowBreadcrumbs';

const EvidenceReportPage = () => {
  const {
    activeIncident,
    evidence,
    environmentalData,
    vessels,
    forecast,
    vesselHistory,
    triggerChatWithQuestion
  } = useIncident();

  const handlePrint = () => {
    window.print();
  };

  if (!activeIncident || !evidence) return null;

  const primaryVessel = vessels && vessels.length > 0 ? vessels[0] : null;

  return (
    <div className="page-wrapper">
      <div className="no-print">
        <WorkflowBreadcrumbs />

        {/* Action Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                Incident Evidence Dossier & Official Investigation Report
              </h1>
              <span className="badge badge-simulated">{activeIncident.id}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Multi-sensor corroboration package compiling satellite detection, hydrodynamic hindcasting, AIS telemetry, and drift projections
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => triggerChatWithQuestion(`Summarize all evidence compiled for ${activeIncident.id}`)}
              className="btn btn-sm btn-cyan-outline"
            >
              <Bot size={14} />
              <span>Ask AI To Summarize Report</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-sm btn-primary"
            >
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Printable Report Document Container */}
      <div
        className="printable-report"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem',
          maxWidth: '1100px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Document Header */}
        <div style={{ borderBottom: '2px solid var(--border-cyan)', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={24} className="text-cyan" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                MARITIME INCIDENT INVESTIGATION REPORT
              </h2>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              AEGIS-SPILL INTELLIGENCE SUITE • AUTONOMOUS MARINE POLLUTION SURVEILLANCE
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-demo" style={{ marginBottom: '4px' }}>
              SIMULATED PROTOTYPE DOSSIER
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              REPORT REF: REP-{activeIncident.id}-V1
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              GENERATED: {new Date().toUTCString()}
            </div>
          </div>
        </div>

        {/* Section 1: Incident Summary */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.6rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3rem' }}>
            1. INCIDENT SUMMARY
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Incident Identifier:</span>{' '}
              <strong className="mono">{activeIncident.id}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>{' '}
              <span className="mono">{activeIncident.displayDate}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Current Status:</span>{' '}
              <strong style={{ color: '#ef4444' }}>{activeIncident.status}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Maritime Region:</span>{' '}
              <span>{activeIncident.region}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Location:</span>{' '}
              <span>{activeIncident.locationName}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Coordinates:</span>{' '}
              <span className="mono">{activeIncident.coordinates?.lat}°N, {activeIncident.coordinates?.lng}°E</span>
            </div>
          </div>
        </div>

        {/* Section 2: Detection & Satellite Characteristics */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.6rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3rem' }}>
            2. SAR SATELLITE DETECTION & MORPHOLOGY
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Satellite Platform:</span>{' '}
              <strong>{activeIncident.sarSatellite}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Sensor Mode & Polarization:</span>{' '}
              <span>{activeIncident.sensorMode}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Ground Resolution:</span>{' '}
              <span>{activeIncident.resolutionMeters}m spatial sampling</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Neural Model:</span>{' '}
              <span>{activeIncident.modelDetails?.name} ({activeIncident.modelDetails?.version})</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Slick Surface Area:</span>{' '}
              <strong className="text-cyan">{activeIncident.spillAreaKm2} km²</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Detection Confidence:</span>{' '}
              <strong style={{ color: '#10b981' }}>{activeIncident.confidence}%</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Slick Dimensions:</span>{' '}
              <span>{activeIncident.spillLengthKm} km (Length) × {activeIncident.spillWidthKm} km (Width)</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Volume:</span>{' '}
              <strong style={{ color: '#f59e0b' }}>{activeIncident.estimatedVolumeM3} m³ (~{activeIncident.estimatedBarrels} barrels)</strong>
            </div>
          </div>
        </div>

        {/* Section 3: Environmental Conditions */}
        {environmentalData && (
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.6rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3rem' }}>
              3. METOCEAN ENVIRONMENTAL CONDITIONS (HINDCAST FORCING)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Wind Vector:</span>{' '}
                <span>{environmentalData.wind?.speedKmh} km/h from {environmentalData.wind?.directionText} ({environmentalData.wind?.directionDeg}°)</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Surface Ocean Current:</span>{' '}
                <span>{environmentalData.oceanCurrent?.speedMs} m/s ({environmentalData.oceanCurrent?.speedKnots} kn) toward {environmentalData.oceanCurrent?.directionText}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Significant Wave Height:</span>{' '}
                <span>{environmentalData.waves?.heightMeters}m ({environmentalData.waves?.periodSeconds}s period) - {environmentalData.waves?.seaState}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Tidal Dynamics:</span>{' '}
                <span>{environmentalData.tide?.phase} (Level: {environmentalData.tide?.levelMeters}m)</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Sea Surface Temp (SST):</span>{' '}
                <span>{environmentalData.seaTemperatureCelsius}°C</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Composite Drift Bearing:</span>{' '}
                <strong className="mono">{environmentalData.oceanCurrent?.netDriftDeg || 138}°</strong>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Hindcast & Probable Source Region */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.6rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3rem' }}>
            4. HINDCAST TRAJECTORY & PROBABLE SOURCE REGION
          </h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Reconstructed Release Window:</span>{' '}
              <strong className="mono" style={{ color: '#f59e0b' }}>
                {activeIncident.probableSourceRegion?.displayWindow}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Probable Source Region Centroid:</span>{' '}
              <strong className="mono">
                {activeIncident.probableSourceRegion?.center?.[0]}°N, {activeIncident.probableSourceRegion?.center?.[1]}°E (Radius: {(activeIncident.probableSourceRegion?.radiusMeters / 1000).toFixed(1)} km)
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Hindcast Source Confidence:</span>{' '}
              <strong style={{ color: '#10b981' }}>{activeIncident.probableSourceRegion?.confidence}%</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Methodology:</span>{' '}
              <span>{activeIncident.probableSourceRegion?.method} with stochastic eddy diffusivity</span>
            </div>
          </div>
        </div>

        {/* Section 5: AIS Vessel Correlation & Candidate Breakdown */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.6rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3rem' }}>
            5. AIS VESSEL CORRELATION & CANDIDATE ANALYSIS
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ background: 'rgba(0, 240, 255, 0.08)', borderBottom: '1px solid var(--border-cyan)', textAlign: 'left' }}>
                <th style={{ padding: '6px 8px' }}>Vessel Name</th>
                <th style={{ padding: '6px 8px' }}>Ship Type</th>
                <th style={{ padding: '6px 8px' }}>MMSI</th>
                <th style={{ padding: '6px 8px' }}>Min Distance</th>
                <th style={{ padding: '6px 8px' }}>Time Overlap</th>
                <th style={{ padding: '6px 8px' }}>Anomalies</th>
                <th style={{ padding: '6px 8px' }}>Correlation</th>
              </tr>
            </thead>
            <tbody>
              {vessels?.map((v) => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: v.candidateRank === 1 ? '#f87171' : 'inherit' }}>
                    {v.name}
                  </td>
                  <td style={{ padding: '6px 8px' }}>{v.shipType}</td>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono)' }}>{v.mmsi}</td>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono)' }}>{v.minSourceDistanceKm || v.distanceFromSourceKm} km</td>
                  <td style={{ padding: '6px 8px' }}>{v.timeOverlap.split('(')[0].trim()}</td>
                  <td style={{ padding: '6px 8px', color: v.behavioralAnomaly !== 'None' ? '#fca5a5' : 'inherit' }}>
                    {v.behavioralAnomaly}
                  </td>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: v.candidateRank === 1 ? '#ef4444' : (v.correlationScore > 40 ? '#f59e0b' : '#3b82f6') }}>
                    {v.correlationScore}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {primaryVessel && (
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 800, color: '#f87171', marginBottom: '4px' }}>
                PRIMARY VESSEL OF INTEREST: {primaryVessel.name} (Score: {primaryVessel.correlationScore}%)
              </div>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <li>Transited within <strong>{primaryVessel.minSourceDistanceKm} km</strong> of the discharge centroid during the 11:45–13:10 UTC release window.</li>
                <li>Track heading of 142° matches the backwards slick axis of 138°.</li>
                <li>Recorded deceleration from 14.2 knots to 4.1 knots and 28° unannounced heading deflection off traffic lane.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Section 6: Forward Spill Forecast */}
        {forecast && (
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.6rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3rem' }}>
              6. FORWARD SPILL FORECAST (+24 HOURS)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.8rem' }}>
              {forecast.timeSteps?.slice(1).map((step) => (
                <div key={step.step} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    HORIZON {step.step}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{step.displayTime}</div>
                  <div style={{ marginTop: '4px' }}>Projected Area: <strong>{step.areaKm2} km²</strong></div>
                  <div>Evaporated Fraction: <strong>{step.evaporationPercent}%</strong></div>
                  <div>Center: <span className="mono">{step.center?.join(', ')}</span></div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#f87171' }}>
              <strong>Coastal Threat:</strong> {forecast.shorelineImpactRisk}
            </div>
          </div>
        )}

        {/* Section 7: Limitations & Uncertainty Statement */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            7. LIMITATIONS & UNCERTAINTY STATEMENT
          </h4>
          <p>
            This dossier is an operational intelligence simulation designed for prototype demonstration in accordance with SIH-2026 guidelines. Reconstructed backward trajectories are subject to oceanographic hydrodynamic resolution limits. Correlation scores denote probabilistic association based on AIS kinematic anomalies and do not establish definitive legal liability. Physical sampling and Port State Control physical inspection are recommended before formal proceedings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EvidenceReportPage;
