import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Play, RefreshCw, Cpu, Layers, CheckCircle2, ShieldCheck, ZoomIn, Sliders } from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

const SARViewer = () => {
  const { activeIncident, detectionState, setDetectionState } = useIncident();
  const [showMask, setShowMask] = useState(true);
  const [showBoundary, setShowBoundary] = useState(true);
  const [progress, setProgress] = useState(100);
  const [statusMessage, setStatusMessage] = useState('Inference Complete: Oil Slick Detected');
  const canvasRef = useRef(null);

  // Run Detection simulation
  const handleRunDetection = () => {
    setDetectionState('PROCESSING');
    setProgress(0);
    setStatusMessage('Ingesting Sentinel-1 SAR level-1 GRD swath...');

    let p = 0;
    const interval = setInterval(() => {
      p += 15;
      if (p === 30) {
        setStatusMessage('Applying Lee filter speckle reduction & calibration...');
      } else if (p === 60) {
        setStatusMessage('Running U-Net deep segmentation tensor pass...');
      } else if (p === 90) {
        setStatusMessage('Extracting morphological boundary polygon & polygonizing...');
      } else if (p >= 100) {
        clearInterval(interval);
        setProgress(100);
        setDetectionState('COMPLETED');
        setStatusMessage('Inference Complete: Oil Slick Detected');
      }
      setProgress(Math.min(100, p));
    }, 300);
  };

  // Render simulated SAR imagery with speckle radar grain on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw dark oceanic radar base with synthetic SAR speckle noise
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // Generate deterministic coherent radar speckle
    for (let i = 0; i < data.length; i += 4) {
      // Rough sea background backscatter: medium gray with speckle
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);

      // Noise factor
      const noise = (Math.random() - 0.5) * 45;
      let val = 85 + noise;

      // Distance from center for vignette
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      val = val * (1 - dist * 0.2);

      data[i] = Math.max(20, Math.min(180, val));     // R
      data[i + 1] = Math.max(25, Math.min(190, val + 5)); // G (subtle radar green-blue tint)
      data[i + 2] = Math.max(35, Math.min(210, val + 15)); // B
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    // 2. If detection is COMPLETED or during processing, draw the dark oil slick (damped surface capillary waves)
    if (detectionState === 'COMPLETED' || detectionState === 'PROCESSING') {
      ctx.save();
      ctx.beginPath();
      // Draw simulated oil slick patch
      ctx.ellipse(width * 0.48, height * 0.52, 95, 38, -0.65, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(12, 18, 28, 0.94)'; // Oil dampens capillary waves -> looks very dark in SAR
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 12;
      ctx.fill();

      // Trailing thin feather
      ctx.beginPath();
      ctx.ellipse(width * 0.62, height * 0.38, 55, 18, -0.62, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(18, 26, 38, 0.88)';
      ctx.fill();
      ctx.restore();

      // 3. Draw AI Segmentation Mask overlay if toggled on and completed
      if (showMask && detectionState === 'COMPLETED') {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(width * 0.48, height * 0.52, 98, 41, -0.65, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.22)';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(width * 0.62, height * 0.38, 58, 20, -0.62, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.22)';
        ctx.fill();
        ctx.restore();
      }

      // 4. Draw Vector Contour Boundary line if toggled
      if (showBoundary && detectionState === 'COMPLETED') {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(width * 0.48, height * 0.52, 99, 42, -0.65, 0, Math.PI * 2);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(width * 0.62, height * 0.38, 59, 21, -0.62, 0, Math.PI * 2);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 5. Draw tactical HUD crosshairs and coordinates
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 1;
    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(width / 2, 10);
    ctx.lineTo(width / 2, height - 10);
    ctx.moveTo(10, height / 2);
    ctx.lineTo(width - 10, height / 2);
    ctx.stroke();

    // Corner brackets
    const bLen = 15;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.beginPath();
    // Top-left
    ctx.moveTo(10, 10 + bLen); ctx.lineTo(10, 10); ctx.lineTo(10 + bLen, 10);
    // Top-right
    ctx.moveTo(width - 10 - bLen, 10); ctx.lineTo(width - 10, 10); ctx.lineTo(width - 10, 10 + bLen);
    // Bottom-left
    ctx.moveTo(10, height - 10 - bLen); ctx.lineTo(10, height - 10); ctx.lineTo(10 + bLen, height - 10);
    // Bottom-right
    ctx.moveTo(width - 10 - bLen, height - 10); ctx.lineTo(width - 10, height - 10); ctx.lineTo(width - 10, height - 10 - bLen);
    ctx.stroke();
    ctx.restore();

  }, [detectionState, showMask, showBoundary, activeIncident]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Layers size={18} className="text-cyan" />
          <span>Simulated SAR Satellite Imagery & Deep Learning Pipeline</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-simulated">U-Net v2.4 Prototype</span>
          <span className="badge badge-demo">Simulated C-Band SAR</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        {/* Left: Canvas SAR Display */}
        <div style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#050a14' }}>
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />

          {/* Overlay HUD Tags */}
          <div style={{ position: 'absolute', top: '10px', left: '12px', display: 'flex', flexDirection: 'column', gap: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(0, 240, 255, 0.85)', background: 'rgba(4, 8, 16, 0.7)', padding: '4px 8px', borderRadius: '4px' }}>
            <span>SENSOR: {activeIncident?.sarSatellite || 'Sentinel-1C'}</span>
            <span>PASS: {activeIncident?.orbitPass || 'Descending'}</span>
            <span>RES: {activeIncident?.resolutionMeters || 10}m GRD</span>
            <span>POL: VV Co-Polar</span>
          </div>

          <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.7)', background: 'rgba(4, 8, 16, 0.7)', padding: '4px 8px', borderRadius: '4px' }}>
            <span>FOV: {activeIncident?.coordinates?.lat}°N, {activeIncident?.coordinates?.lng}°E</span>
          </div>

          {/* Processing Spinner Overlay */}
          {detectionState === 'PROCESSING' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(6, 11, 24, 0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', zIndex: 10 }}>
              <RefreshCw size={36} className="text-cyan" style={{ animation: 'spin 1.2s linear infinite' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {statusMessage}
                </div>
                <div style={{ width: '220px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.25s ease' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls & Detection Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Detection Pipeline
              </span>
              <button
                onClick={handleRunDetection}
                disabled={detectionState === 'PROCESSING'}
                className="btn btn-sm btn-primary"
              >
                {detectionState === 'PROCESSING' ? (
                  <>
                    <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Run Detection</span>
                  </>
                )}
              </button>
            </div>

            {/* Pipeline Stage Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className={`badge ${detectionState === 'IDLE' ? 'badge-warning' : 'badge-simulated'}`}>
                1. NEW SWATH
              </span>
              <span style={{ color: 'var(--text-dim)' }}>→</span>
              <span className={`badge ${detectionState === 'PROCESSING' ? 'badge-danger badge-pulse' : 'badge-simulated'}`}>
                2. PROCESSING
              </span>
              <span style={{ color: 'var(--text-dim)' }}>→</span>
              <span className={`badge ${detectionState === 'COMPLETED' ? 'badge-success' : 'badge-simulated'}`}>
                3. COMPLETED
              </span>
            </div>

            {/* Inference Results Card */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={16} className="text-success" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Oil Slick Detected
                </span>
                <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                  {activeIncident?.confidence || 94.2}% Confidence
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Area:</span>{' '}
                  <strong className="text-cyan">{activeIncident?.spillAreaKm2 || 18.7} km²</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Est. Volume:</span>{' '}
                  <strong style={{ color: '#f59e0b' }}>{activeIncident?.estimatedVolumeM3 || 420} m³</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Length × Width:</span>{' '}
                  <span>{activeIncident?.spillLengthKm || 8.4} × {activeIncident?.spillWidthKm || 2.6} km</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Contrast:</span>{' '}
                  <span>-6.8 dB (Low Backscatter)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Layer toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setShowMask(!showMask)}
              className={`btn btn-sm ${showMask ? 'btn-cyan-outline' : 'btn-secondary'}`}
            >
              {showMask ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>Segmentation Mask</span>
            </button>
            <button
              onClick={() => setShowBoundary(!showBoundary)}
              className={`btn btn-sm ${showBoundary ? 'btn-cyan-outline' : 'btn-secondary'}`}
            >
              {showBoundary ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>Vector Boundary</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SARViewer;
