import React, { useState, useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Circle,
  Marker,
  Popup,
  Tooltip,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { Layers, Eye, EyeOff, Navigation, Wind, Compass, Ship, AlertCircle } from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

// Helper to recenter map when active incident changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 10, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

// Function to interpolate vessel position based on timelineProgress (0 to 100)
function getInterpolatedVesselPosition(track, progress) {
  if (!track || track.length === 0) return null;
  if (track.length === 1) return track[0];

  // Map 0-100 progress to track indices
  const totalSegments = track.length - 1;
  const progressRatio = Math.max(0, Math.min(1, progress / 100));
  const exactIndex = progressRatio * totalSegments;
  const lowerIndex = Math.floor(exactIndex);
  const upperIndex = Math.min(totalSegments, lowerIndex + 1);
  const segmentFraction = exactIndex - lowerIndex;

  const p1 = track[lowerIndex];
  const p2 = track[upperIndex];

  const lat = p1.lat + (p2.lat - p1.lat) * segmentFraction;
  const lng = p1.lng + (p2.lng - p1.lng) * segmentFraction;
  const sog = (p1.sog + (p2.sog - p1.sog) * segmentFraction).toFixed(1);
  const heading = Math.round(p1.heading + (p2.heading - p1.heading) * segmentFraction);

  return { lat, lng, sog, heading, time: p1.time };
}

// Custom DivIcons
const createVesselIcon = (vessel, isPrimary, heading) => {
  const color = vessel.color || (isPrimary ? '#ef4444' : '#3b82f6');
  const size = isPrimary ? 34 : 26;

  return L.divIcon({
    className: 'custom-vessel-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(${heading || 0}deg);
        filter: drop-shadow(0 0 6px ${color});
        cursor: pointer;
      ">
        <svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" stroke="#060b18" stroke-width="1.5">
          <polygon points="12,2 20,20 12,16 4,20" />
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

const createSourceIcon = () => {
  return L.divIcon({
    className: 'custom-source-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(245, 158, 11, 0.4);
        border: 2px solid #f59e0b;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 14px #f59e0b;
      ">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const LeafletMap = ({ height = '580px' }) => {
  const {
    activeIncident,
    environmentalData,
    vessels,
    forecast,
    selectedVessel,
    setSelectedVessel,
    timelineProgress
  } = useIncident();

  // Layer Visibility State
  const [layers, setLayers] = useState({
    slick: true,
    slickBoundary: true,
    backwardTrajectory: true,
    probableSource: true,
    vesselTracks: true,
    vesselPositions: true,
    forecastPath: true,
    uncertaintyCorridor: true,
    environmentalVectors: true
  });

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const centerCoords = activeIncident?.coordinates
    ? [activeIncident.coordinates.lat, activeIncident.coordinates.lng]
    : [18.824, 72.842];

  // Slick polygon coordinates
  const slickCoords = useMemo(() => {
    return activeIncident?.slickPolygon || [
      [18.852, 72.810],
      [18.848, 72.825],
      [18.835, 72.840],
      [18.818, 72.862],
      [18.802, 72.875],
      [18.808, 72.855],
      [18.825, 72.830],
      [18.840, 72.815]
    ];
  }, [activeIncident]);

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#0a1424' }}>
      <MapContainer
        center={centerCoords}
        zoom={10}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapRecenter center={centerCoords} />

        {/* Tactical Dark Ocean Base Map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={18}
        />

        {/* 1. Probable Source Region (Lagrangian Particle Hindcast) */}
        {layers.probableSource && activeIncident?.probableSourceRegion && (
          <>
            <Circle
              center={activeIncident.probableSourceRegion.center}
              radius={activeIncident.probableSourceRegion.radiusMeters || 2400}
              pathOptions={{
                color: '#f59e0b',
                fillColor: '#f59e0b',
                fillOpacity: 0.22,
                weight: 2,
                dashArray: '6, 6'
              }}
            >
              <Tooltip direction="top" permanent={false} opacity={0.9}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  <strong style={{ color: '#f59e0b' }}>PROBABLE SOURCE REGION</strong>
                  <div>Release Window: {activeIncident.probableSourceRegion.displayWindow}</div>
                  <div>Source Confidence: {activeIncident.probableSourceRegion.confidence}%</div>
                  <div>Radius: {(activeIncident.probableSourceRegion.radiusMeters / 1000).toFixed(1)} km</div>
                </div>
              </Tooltip>
            </Circle>

            <Marker
              position={activeIncident.probableSourceRegion.center}
              icon={createSourceIcon()}
            >
              <Popup>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  <h4 style={{ color: '#f59e0b', marginBottom: '4px' }}>Reconstructed Discharge Point</h4>
                  <div>Centroid: {activeIncident.probableSourceRegion.center.join(', ')}</div>
                  <div>Method: {activeIncident.probableSourceRegion.method}</div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* 2. Backward Trajectory Line (Hindcast drift vector) */}
        {layers.backwardTrajectory && activeIncident?.backwardTrajectory && (
          <Polyline
            positions={activeIncident.backwardTrajectory}
            pathOptions={{
              color: '#f59e0b',
              weight: 3,
              dashArray: '8, 8',
              opacity: 0.85
            }}
          >
            <Tooltip direction="center">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#f59e0b' }}>
                Backward Drift Trajectory (3.5h Hindcast)
              </span>
            </Tooltip>
          </Polyline>
        )}

        {/* 3. Detected Oil Slick Polygon */}
        {layers.slick && (
          <Polygon
            positions={slickCoords}
            pathOptions={{
              color: layers.slickBoundary ? '#00f0ff' : 'transparent',
              weight: layers.slickBoundary ? 2 : 0,
              fillColor: '#00f0ff',
              fillOpacity: 0.35
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                <strong style={{ color: '#00f0ff', fontSize: '0.9rem', display: 'block' }}>
                  {activeIncident?.id} - Detected Oil Slick
                </strong>
                <div>Area: <strong>{activeIncident?.spillAreaKm2} km²</strong></div>
                <div>Confidence: <strong>{activeIncident?.confidence}%</strong></div>
                <div>Sensor: {activeIncident?.sarSatellite}</div>
                <div>Detected: {activeIncident?.displayDate}</div>
              </div>
            </Popup>
          </Polygon>
        )}

        {/* 4. Forecast Uncertainty Corridor Envelope */}
        {layers.uncertaintyCorridor && forecast?.uncertaintyCorridor && (
          <Polygon
            positions={forecast.uncertaintyCorridor}
            pathOptions={{
              color: '#8b5cf6',
              weight: 1.5,
              dashArray: '4, 4',
              fillColor: '#8b5cf6',
              fillOpacity: 0.14
            }}
          >
            <Tooltip direction="bottom">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#a78bfa' }}>
                24h Forecast Uncertainty Corridor ({forecast.overallConfidencePercent}% Conf.)
              </span>
            </Tooltip>
          </Polygon>
        )}

        {/* 5. Forecast Center Trajectory Line */}
        {layers.forecastPath && forecast?.forecastPath && (
          <>
            <Polyline
              positions={forecast.forecastPath}
              pathOptions={{
                color: '#ec4899',
                weight: 3.5,
                opacity: 0.9
              }}
            />
            {/* Forecast step points (+6h, +12h, +24h) */}
            {forecast.timeSteps?.map((ts, idx) => (
              <Circle
                key={ts.step}
                center={ts.center}
                radius={ts.corridorRadiusMeters || 1200}
                pathOptions={{
                  color: idx === 0 ? '#00f0ff' : '#ec4899',
                  fillColor: idx === 0 ? '#00f0ff' : '#ec4899',
                  fillOpacity: 0.3,
                  weight: 1.5
                }}
              >
                <Tooltip direction="right" permanent={false}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                    <strong style={{ color: '#ec4899' }}>FORECAST {ts.step}</strong>
                    <div>Time: {ts.displayTime || ts.step}</div>
                    <div>Predicted Area: {ts.areaKm2} km²</div>
                    {ts.remainingVolumeM3 && <div>Est. Volume: {ts.remainingVolumeM3} m³</div>}
                  </div>
                </Tooltip>
              </Circle>
            ))}
          </>
        )}

        {/* 6. Vessel Tracks (Polylines) */}
        {layers.vesselTracks && vessels?.map((vessel) => {
          if (!vessel.track || vessel.track.length < 2) return null;
          const coords = vessel.track.map(t => [t.lat, t.lng]);
          const isSelected = selectedVessel?.id === vessel.id;
          const isPrimary = vessel.candidateRank === 1;

          return (
            <Polyline
              key={`track-${vessel.id}`}
              positions={coords}
              pathOptions={{
                color: vessel.color || (isPrimary ? '#ef4444' : '#3b82f6'),
                weight: isSelected ? 4 : (isPrimary ? 3 : 2),
                opacity: isSelected ? 1 : 0.65,
                dashArray: isPrimary ? null : '4, 4'
              }}
            >
              <Tooltip direction="top">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  {vessel.name} ({vessel.shipType}) • Track
                </span>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* 7. Vessel Animated Positions (Interpolated by Timeline) */}
        {layers.vesselPositions && vessels?.map((vessel) => {
          const isPrimary = vessel.candidateRank === 1;
          const isSelected = selectedVessel?.id === vessel.id;
          const pos = getInterpolatedVesselPosition(vessel.track, timelineProgress);
          if (!pos) return null;

          return (
            <Marker
              key={`pos-${vessel.id}`}
              position={[pos.lat, pos.lng]}
              icon={createVesselIcon(vessel, isPrimary || isSelected, pos.heading)}
              eventHandlers={{
                click: () => setSelectedVessel(vessel)
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: vessel.color || '#ef4444', fontSize: '0.9rem' }}>
                      {vessel.name}
                    </strong>
                    <span className="badge badge-sm" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}>
                      {vessel.correlationScore}% Score
                    </span>
                  </div>
                  <div>Type: <strong>{vessel.shipType}</strong></div>
                  <div>MMSI: {vessel.mmsi} | IMO: {vessel.imo}</div>
                  <div>Speed: <strong>{pos.sog} knots</strong> | Heading: <strong>{pos.heading}°</strong></div>
                  <div>Dist. from Source: <strong>{vessel.distanceFromSourceKm} km</strong></div>
                  <div>Status: <span style={{ color: isPrimary ? '#ef4444' : '#94a3b8' }}>{vessel.candidateTag}</span></div>
                  {vessel.behavioralAnomaly && (
                    <div style={{ marginTop: '4px', padding: '4px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '4px', color: '#fca5a5', fontSize: '0.72rem' }}>
                      Anomaly: {vessel.behavioralAnomaly}
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedVessel(vessel)}
                    className="btn btn-sm btn-cyan-outline"
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    Inspect Vessel Correlation
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Tactical Layer Control Panel */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000, background: 'rgba(10, 19, 36, 0.92)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', width: '220px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          <Layers size={14} />
          <span>MAP LAYERS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.72rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: layers.slick ? '#00f0ff' : 'var(--text-muted)' }}>
            <span>Detected Slick</span>
            <input type="checkbox" checked={layers.slick} onChange={() => toggleLayer('slick')} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: layers.probableSource ? '#f59e0b' : 'var(--text-muted)' }}>
            <span>Probable Source Region</span>
            <input type="checkbox" checked={layers.probableSource} onChange={() => toggleLayer('probableSource')} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: layers.backwardTrajectory ? '#fbbf24' : 'var(--text-muted)' }}>
            <span>Backward Hindcast Path</span>
            <input type="checkbox" checked={layers.backwardTrajectory} onChange={() => toggleLayer('backwardTrajectory')} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: layers.vesselPositions ? '#ef4444' : 'var(--text-muted)' }}>
            <span>Candidate Vessels</span>
            <input type="checkbox" checked={layers.vesselPositions} onChange={() => toggleLayer('vesselPositions')} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: layers.vesselTracks ? '#60a5fa' : 'var(--text-muted)' }}>
            <span>Vessel AIS Tracks</span>
            <input type="checkbox" checked={layers.vesselTracks} onChange={() => toggleLayer('vesselTracks')} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: layers.forecastPath ? '#ec4899' : 'var(--text-muted)' }}>
            <span>Forward Forecast Path</span>
            <input type="checkbox" checked={layers.forecastPath} onChange={() => toggleLayer('forecastPath')} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: layers.uncertaintyCorridor ? '#a78bfa' : 'var(--text-muted)' }}>
            <span>Uncertainty Corridor</span>
            <input type="checkbox" checked={layers.uncertaintyCorridor} onChange={() => toggleLayer('uncertaintyCorridor')} />
          </label>
        </div>
      </div>

      {/* Floating Tactical Environmental Wind & Current Vector HUD */}
      {environmentalData && (
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 1000, background: 'rgba(10, 19, 36, 0.88)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
            <Wind size={13} />
            <span>WIND: {environmentalData.wind?.speedKmh} km/h {environmentalData.wind?.directionText} ({environmentalData.wind?.directionDeg}°)</span>
          </div>
          <div style={{ height: '14px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399' }}>
            <Compass size={13} />
            <span>CURRENT: {environmentalData.oceanCurrent?.speedMs} m/s {environmentalData.oceanCurrent?.directionText}</span>
          </div>
          <div style={{ height: '14px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ color: '#fbbf24' }}>
            <span>SST: {environmentalData.seaTemperatureCelsius}°C</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeafletMap;
