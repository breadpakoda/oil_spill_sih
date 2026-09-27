import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Wind,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Layers,
  ArrowRight,
  Bot,
  Activity,
  CheckCircle2,
  Droplet
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import WorkflowBreadcrumbs from '../components/WorkflowBreadcrumbs';
import LeafletMap from '../components/LeafletMap';

const ForecastPage = () => {
  const {
    activeIncident,
    forecast,
    environmentalData,
    triggerChatWithQuestion
  } = useIncident();

  const navigate = useNavigate();

  const [activeStepTab, setActiveStepTab] = useState('+24h');

  if (!activeIncident || !forecast) return null;

  const currentStep = forecast.timeSteps?.find(t => t.step === activeStepTab) || forecast.timeSteps?.[1];

  return (
    <div className="page-wrapper">
      <WorkflowBreadcrumbs />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Forward Oil Spill Drift & Weathering Forecast
            </h1>
            <span className="badge badge-demo">Simulated Forecast</span>
            <span className="badge badge-success">{forecast.overallConfidencePercent}% Confidence</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Lagrangian hydrodynamic particle dispersion and ADIOS/GNOME weathering physics simulation (+24 Hours)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => triggerChatWithQuestion(`What is the 24 hour forecast and shoreline risk for ${activeIncident.id}?`)}
            className="btn btn-sm btn-cyan-outline"
          >
            <Bot size={14} />
            <span>Ask AI: Shoreline Risk</span>
          </button>
          <button
            onClick={() => navigate('/report')}
            className="btn btn-sm btn-primary"
          >
            <span>Generate Report</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Shoreline Threat Alert Banner */}
      <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <AlertTriangle size={22} className="text-danger" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 800, color: '#f87171', fontSize: '0.88rem' }}>
            SHORELINE IMPACT ASSESSMENT: {forecast.shorelineImpactRisk}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Spill trajectory is bearing {forecast.driftBearingDeg}° at {forecast.meanDriftSpeedKnots} knots toward sensitive coastal aquaculture and beach zones within 24–36 hours.
          </div>
        </div>
      </div>

      {/* Map Preview Showing Forecast Trajectory & Uncertainty Corridor */}
      <div className="card" style={{ padding: '0.85rem', marginBottom: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '0.75rem' }}>
          <div className="card-title">
            <Compass size={18} className="text-cyan" />
            <span>Predicted Dispersion Trajectory & Uncertainty Corridor Envelope</span>
          </div>
          <span className="badge badge-simulated">Monte-Carlo Ensemble</span>
        </div>
        <LeafletMap height="440px" />
      </div>

      {/* Forecast Horizons Selector: +6h, +12h, +24h (Section 21) */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Clock size={16} className="text-cyan" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
            Select Forecast Time Horizon:
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {forecast.timeSteps?.map((step) => {
            const isSelected = activeStepTab === step.step;
            return (
              <div
                key={step.step}
                onClick={() => setActiveStepTab(step.step)}
                className={`card card-interactive ${isSelected ? 'active-card' : ''}`}
                style={{
                  border: isSelected ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(0, 240, 255, 0.08)' : 'var(--bg-card)',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span className="mono" style={{ fontWeight: 800, fontSize: '1.1rem', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {step.step.toUpperCase()}
                  </span>
                  <span className="badge badge-simulated" style={{ fontSize: '0.65rem' }}>
                    {step.hoursAhead === 0 ? 'Detection' : `+${step.hoursAhead}h`}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {step.displayTime}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Projected Area:</span>
                  <strong className="text-cyan">{step.areaKm2} km²</strong>
                </div>

                {step.evaporationPercent !== undefined && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Evaporated:</span>
                    <strong style={{ color: '#f59e0b' }}>{step.evaporationPercent}%</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Time Horizon In-depth Breakdown */}
      {currentStep && (
        <div className="grid-2">
          {/* Weathering Metrics */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Droplet size={18} className="text-cyan" />
                <span>Weathering & State at {currentStep.step}</span>
              </div>
              <span className="badge badge-simulated">ADIOS Physics Engine</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', fontSize: '0.82rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>PROJECTED SLICK AREA</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.areaKm2} km²
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Expansion due to gravitational-viscous spreading
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>NATURAL EVAPORATION</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.evaporationPercent}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Light fractions lost to atmospheric vaporization
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>WATER EMULSIFICATION</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ec4899', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.emulsionWaterPercent || 35}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  "Chocolate mousse" heavy emulsion formation
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>REMAINING VOLUME</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.remainingVolumeM3 || 320} m³
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Persistent heavy oil fraction on surface
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Containment & Mitigation Actions */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <ShieldAlert size={18} className="text-cyan" />
                <span>Recommended Containment & Mitigation Actions</span>
              </div>
              <span className="badge badge-warning">Action Plan</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {(forecast.recommendedMitigationActions || [
                "Deploy offshore containment booms at grid point 18.72°N, 72.96°E before +12h",
                "Alert Coast Guard Station Murud for secondary shoreline protection",
                "Prepare skimmer vessels for heavy emulsified mousse recovery",
                "Maintain active aerial surveillance drone passes every 4 hours"
              ]).map((action, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem'
                  }}
                >
                  <CheckCircle2 size={16} className="text-cyan" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {action}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/report')}
              className="btn btn-sm btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Export Mitigation Plan into Investigation Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastPage;
