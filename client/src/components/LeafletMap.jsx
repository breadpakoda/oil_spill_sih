import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import 'maplibre-gl/dist/maplibre-gl.css';
import '@maplibre/maplibre-gl-leaflet';
import {
  Layers,
  Crosshair,
  Wind,
  Compass,
  Ship,
  Radio,
  ArrowRight,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  Map as MapIcon
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

// Working Map Providers Configuration featuring OpenFreeMap
const BASEMAPS = {
  openfreemapLiberty: {
    id: 'openfreemapLiberty',
    name: 'OpenFreeMap Liberty (Vector)',
    isVector: true,
    url: 'https://tiles.openfreemap.org/styles/liberty',
    attribution: '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  openfreemapPositron: {
    id: 'openfreemapPositron',
    name: 'OpenFreeMap Positron (Vector)',
    isVector: true,
    url: 'https://tiles.openfreemap.org/styles/positron',
    attribution: '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  openfreemapBright: {
    id: 'openfreemapBright',
    name: 'OpenFreeMap Bright (Vector)',
    isVector: true,
    url: 'https://tiles.openfreemap.org/styles/bright',
    attribution: '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  osm: {
    id: 'osm',
    name: 'OpenStreetMap Standard',
    isVector: false,
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  cartoDark: {
    id: 'cartoDark',
    name: 'Dark Ocean Tactical',
    isVector: false,
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  },
  esriOcean: {
    id: 'esriOcean',
    name: 'ESRI Ocean Bathymetry',
    isVector: false,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic',
    maxZoom: 13
  },
  esriSatellite: {
    id: 'esriSatellite',
    name: 'Satellite Imagery',
    isVector: false,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid',
    maxZoom: 18
  }
};

// OpenFreeMap MapLibre Vector Tile Layer for Leaflet
function OpenFreeMapLayer({ styleUrl }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !L.maplibreGL) return;

    let glLayer = null;
    try {
      glLayer = L.maplibreGL({
        style: styleUrl,
        attribution: '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
      glLayer.addTo(map);
    } catch (err) {
      console.warn('OpenFreeMap layer initialization warning:', err);
    }

    return () => {
      if (glLayer && map) {
        try {
          map.removeLayer(glLayer);
        } catch (e) {}
      }
    };
  }, [map, styleUrl]);

  return null;
}

// Helper to recenter map and invalidate size on mount
function MapController({ center, triggerRecenter }) {
  const map = useMap();

  useEffect(() => {
    // Invalidate map size to ensure 100% tile rendering on layout mount
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 10, { duration: 1.0 });
    }
  }, [center, map]);

  useEffect(() => {
    if (triggerRecenter && center && center[0] && center[1]) {
      map.flyTo(center, 10, { duration: 0.8 });
    }
  }, [triggerRecenter, center, map]);

  return null;
}

// Function to interpolate vessel position based on timelineProgress (0 to 100)
function getInterpolatedVesselPosition(track, progress) {
  if (!track || track.length === 0) return null;
  if (track.length === 1) return track[0];

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
const createVesselIcon = (vessel, isPrimary, heading, isOverview = false) => {
  const color = vessel.color || (isPrimary ? '#ef4444' : '#3b82f6');
  const size = isOverview ? 24 : (isPrimary ? 32 : 26);

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
        filter: drop-shadow(0 0 ${isOverview ? '4px' : '6px'} ${color});
        cursor: pointer;
        transition: transform 0.2s ease;
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
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: rgba(245, 158, 11, 0.4);
        border: 2px solid #f59e0b;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 12px #f59e0b;
      ">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

const LeafletMap = ({
  height = '100%',
  mode = 'overview', // 'overview' | 'tactical' | 'forecast'
  customCenter = null
}) => {
  const {
    activeIncident,
    environmentalData,
    vessels,
    forecast,
    selectedVessel,
    setSelectedVessel,
    timelineProgress
  } = useIncident();

  const navigate = useNavigate();
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);
  const [recenterCounter, setRecenterCounter] = useState(0);
  const [activeBasemap, setActiveBasemap] = useState('openfreemapLiberty');

  const isOverview = mode === 'overview';

  // Layer Visibility State configured by mode
  const [layers, setLayers] = useState(() => {
    if (mode === 'overview') {
      return {
        slick: true,
        vessels: true,
        sourceRegion: false,
        vesselTracks: false,
        backtrack: false,
        forecast: false,
        wind: false,
        current: false,
        waves: false,
        satellite: false
      };
    } else if (mode === 'forecast') {
      return {
        slick: true,
        vessels: true,
        sourceRegion: false,
        vesselTracks: false,
        backtrack: false,
        forecast: true,
        wind: true,
        current: true,
        waves: false,
        satellite: false
      };
    } else {
      // tactical mode
      return {
        slick: true,
        vessels: true,
        sourceRegion: true,
        vesselTracks: true,
        backtrack: true,
        forecast: true,
        wind: true,
        current: true,
        waves: false,
        satellite: false
      };
    }
  });

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const centerCoords = customCenter || (activeIncident?.coordinates
    ? [activeIncident.coordinates.lat, activeIncident.coordinates.lng]
    : [18.824, 72.842]);

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

  // Synthetic SAR swath polygon for remote sensing layer
  const satelliteSwathCoords = useMemo(() => {
    if (!centerCoords) return [];
    const [lat, lng] = centerCoords;
    return [
      [lat + 0.35, lng - 0.45],
      [lat + 0.42, lng + 0.30],
      [lat - 0.35, lng + 0.45],
      [lat - 0.42, lng - 0.30]
    ];
  }, [centerCoords]);

  const currentBasemap = BASEMAPS[activeBasemap] || BASEMAPS.cartoDark;

  return (
    <div className={`operational-map-container ${isOverview ? 'map-overview-mode' : 'map-standard-mode'}`} style={{ width: '100%', height, position: 'relative' }}>
      <MapContainer
        center={centerCoords}
        zoom={10}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', background: '#0a1424' }}
      >
        <MapController center={centerCoords} triggerRecenter={recenterCounter} />

        {/* Active Base Map Layer (OpenFreeMap Vector or TileLayer Raster) */}
        {currentBasemap.isVector ? (
          <OpenFreeMapLayer key={currentBasemap.id} styleUrl={currentBasemap.url} />
        ) : (
          <TileLayer
            key={currentBasemap.id}
            url={currentBasemap.url}
            attribution={currentBasemap.attribution}
            subdomains={currentBasemap.subdomains || 'abc'}
            maxZoom={currentBasemap.maxZoom || 18}
          />
        )}

        {/* ── 1. SAR Satellite Swath Layer (Remote Sensing) ── */}
        {layers.satellite && (
          <Polygon
            positions={satelliteSwathCoords}
            pathOptions={{
              color: '#38bdf8',
              weight: 1.5,
              dashArray: '5, 5',
              fillColor: '#38bdf8',
              fillOpacity: 0.08
            }}
          >
            <Tooltip direction="top">
              <span className="mono" style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
                SAR Swath: {activeIncident?.sarSatellite || 'Sentinel-1B / C-Band'} (Orbit 4812)
              </span>
            </Tooltip>
          </Polygon>
        )}

        {/* ── 2. Probable Source Region (Lagrangian Hindcast) ── */}
        {layers.sourceRegion && activeIncident?.probableSourceRegion && (
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
              <Tooltip direction="top" opacity={0.95}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
                  <strong style={{ color: '#f59e0b' }}>PROBABLE SOURCE REGION</strong>
                  <div>Window: {activeIncident.probableSourceRegion.displayWindow}</div>
                  <div>Confidence: {activeIncident.probableSourceRegion.confidence}%</div>
                </div>
              </Tooltip>
            </Circle>

            <Marker
              position={activeIncident.probableSourceRegion.center}
              icon={createSourceIcon()}
            >
              <Popup className="operational-popup">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '4px' }}>Reconstructed Discharge Point</div>
                  <div>Centroid: {activeIncident.probableSourceRegion.center.join('°, ')}°</div>
                  <div>Method: {activeIncident.probableSourceRegion.method}</div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* ── 3. Backtrack Trajectory Line (Hindcast drift) ── */}
        {layers.backtrack && activeIncident?.backwardTrajectory && (
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
              <span className="mono" style={{ fontSize: '0.72rem', color: '#f59e0b' }}>
                Backward Drift Trajectory (3.5h Hindcast)
              </span>
            </Tooltip>
          </Polyline>
        )}

        {/* ── 4. Detected Oil Slick Polygon & Minimal Popup ── */}
        {layers.slick && (
          <Polygon
            positions={slickCoords}
            pathOptions={{
              color: '#00f0ff',
              weight: 2,
              fillColor: '#00f0ff',
              fillOpacity: 0.32
            }}
          >
            <Popup className="operational-popup minimal-incident-popup">
              {isOverview ? (
                /* Google Maps Style Clean Minimal Popup on Landing Page */
                <div className="popup-minimal-container">
                  <div className="popup-minimal-header">
                    <span className="popup-tag-danger">OIL SPILL DETECTED</span>
                  </div>

                  <div className="popup-minimal-body">
                    <div className="popup-id-line mono">{activeIncident?.id}</div>
                    <div className="popup-date-line">{activeIncident?.displayDate || '27 Sep 2026 • 14:32 UTC'}</div>

                    <div className="popup-stats-row">
                      <span className="popup-stat-item font-mono">
                        <strong>{activeIncident?.spillAreaKm2}</strong> km²
                      </span>
                      <span className="popup-stat-item text-primary font-mono font-bold">
                        {activeIncident?.confidence}% detection confidence
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/incident')}
                    className="popup-action-btn"
                  >
                    <span>OPEN INCIDENT</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ) : (
                /* Investigation/Tactical Popup */
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#00f0ff', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>
                    {activeIncident?.id} - Detected Slick
                  </strong>
                  <div>Area: <strong>{activeIncident?.spillAreaKm2} km²</strong></div>
                  <div>Confidence: <strong>{activeIncident?.confidence}%</strong></div>
                  <div>Sensor: {activeIncident?.sarSatellite}</div>
                  <div>Detected: {activeIncident?.displayDate}</div>
                  <button
                    onClick={() => navigate('/incident')}
                    className="btn btn-sm btn-primary"
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    Investigate SAR Detection
                  </button>
                </div>
              )}
            </Popup>
          </Polygon>
        )}

        {/* ── 5. Forecast Uncertainty Corridor Envelope ── */}
        {layers.forecast && forecast?.uncertaintyCorridor && (
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
              <span className="mono" style={{ fontSize: '0.72rem', color: '#a78bfa' }}>
                24h Drift Envelope ({forecast.overallConfidencePercent}% Conf.)
              </span>
            </Tooltip>
          </Polygon>
        )}

        {/* ── 6. Forward Forecast Trajectory Line ── */}
        {layers.forecast && forecast?.forecastPath && (
          <>
            <Polyline
              positions={forecast.forecastPath}
              pathOptions={{
                color: '#ec4899',
                weight: 3,
                opacity: 0.9
              }}
            />
            {forecast.timeSteps?.map((ts, idx) => (
              <Circle
                key={ts.step}
                center={ts.center}
                radius={ts.corridorRadiusMeters || 1200}
                pathOptions={{
                  color: idx === 0 ? '#00f0ff' : '#ec4899',
                  fillColor: idx === 0 ? '#00f0ff' : '#ec4899',
                  fillOpacity: 0.28,
                  weight: 1.5
                }}
              >
                <Tooltip direction="right">
                  <div className="mono" style={{ fontSize: '0.72rem' }}>
                    <strong style={{ color: '#ec4899' }}>FORECAST {ts.step}</strong>
                    <div>Area: {ts.areaKm2} km²</div>
                  </div>
                </Tooltip>
              </Circle>
            ))}
          </>
        )}

        {/* ── 7. Vessel Tracks ── */}
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
                weight: isSelected ? 4 : (isPrimary ? 2.5 : 1.5),
                opacity: isSelected ? 0.95 : 0.6,
                dashArray: isPrimary ? null : '4, 4'
              }}
            >
              <Tooltip direction="top">
                <span className="mono" style={{ fontSize: '0.72rem' }}>
                  {vessel.name} ({vessel.shipType})
                </span>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* ── 8. Relevant Vessels (Markers & Minimal Popups) ── */}
        {layers.vessels && vessels?.map((vessel) => {
          const isPrimary = vessel.candidateRank === 1;
          const isSelected = selectedVessel?.id === vessel.id;
          const pos = (mode === 'tactical')
            ? getInterpolatedVesselPosition(vessel.track, timelineProgress)
            : (vessel.track?.[vessel.track.length - 1] || { lat: vessel.coordinates?.lat || 18.85, lng: vessel.coordinates?.lng || 72.82, heading: 140, sog: 4.5 });

          if (!pos) return null;

          return (
            <Marker
              key={`pos-${vessel.id}`}
              position={[pos.lat, pos.lng]}
              icon={createVesselIcon(vessel, isPrimary || isSelected, pos.heading, isOverview)}
              eventHandlers={{
                click: () => setSelectedVessel(vessel)
              }}
            >
              <Popup className="operational-popup minimal-vessel-popup">
                {isOverview ? (
                  /* Google Maps Minimal Vessel Popup */
                  <div className="popup-minimal-container">
                    <div className="popup-minimal-header">
                      <strong className="popup-vessel-name">{vessel.name}</strong>
                      <span className="popup-vessel-sub">
                        {isPrimary ? 'Primary Candidate' : 'Vessel of Interest'}
                      </span>
                    </div>

                    <div className="popup-minimal-body">
                      <div className="popup-pos-label">Position</div>
                      <div className="popup-pos-val font-mono">
                        {pos.lat?.toFixed(2)}° N, {pos.lng?.toFixed(2)}° E
                      </div>
                      <div className="popup-vessel-telemetry font-mono">
                        {vessel.shipType} • {pos.sog || '6.4'} kts
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/vessels')}
                      className="popup-action-btn"
                    >
                      <span>VIEW VESSEL</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  /* Detailed Tactical Vessel Popup */
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', minWidth: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: vessel.color || '#ef4444', fontSize: '0.9rem' }}>
                        {vessel.name}
                      </strong>
                      <span className="badge badge-sm" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}>
                        {vessel.correlationScore}%
                      </span>
                    </div>
                    <div>Type: <strong>{vessel.shipType}</strong></div>
                    <div>MMSI: {vessel.mmsi}</div>
                    <div>Speed: <strong>{pos.sog} kts</strong> | Heading: <strong>{pos.heading}°</strong></div>
                    <div>Dist. Source: <strong>{vessel.distanceFromSourceKm} km</strong></div>
                    <button
                      onClick={() => navigate('/vessels')}
                      className="btn btn-sm btn-cyan-outline"
                      style={{ width: '100%', marginTop: '6px' }}
                    >
                      Inspect Vessel Correlation
                    </button>
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* ── Compact Floating Map Controls (Google Maps philosophy: + / -, Layers, Recenter) ── */}
      <div className="floating-map-controls">
        {/* Recenter button */}
        <button
          onClick={() => setRecenterCounter(c => c + 1)}
          className="map-control-pill-btn"
          title="Recenter Map on Active Incident"
        >
          <Crosshair size={16} />
        </button>

        {/* Layers toggle button */}
        <div className="layers-control-wrapper">
          <button
            onClick={() => setLayersMenuOpen(!layersMenuOpen)}
            className={`map-control-pill-btn ${layersMenuOpen ? 'active' : ''}`}
            title="Map Layers & Basemap"
          >
            <Layers size={16} />
            <span className="control-btn-label">Layers</span>
          </button>

          {/* On-demand Layers Dropdown Popover */}
          {layersMenuOpen && (
            <div className="compact-layers-popover">
              {/* Basemap Selection */}
              <div className="layers-popover-header">
                <span>BASEMAP API</span>
              </div>
              <div className="basemap-selector-grid">
                {Object.values(BASEMAPS).map((bm) => (
                  <button
                    key={bm.id}
                    onClick={() => setActiveBasemap(bm.id)}
                    className={`basemap-option-btn ${activeBasemap === bm.id ? 'active' : ''}`}
                  >
                    <span className="bm-dot" />
                    <span>{bm.name}</span>
                  </button>
                ))}
              </div>

              <div className="layers-popover-divider" />

              <div className="layers-popover-header">
                <span>OPERATIONAL OVERLAYS</span>
              </div>

              <div className="layers-popover-content">
                {/* Core Primary Overlays */}
                <label className="layer-item-checkbox">
                  <input
                    type="checkbox"
                    checked={layers.slick}
                    onChange={() => toggleLayer('slick')}
                  />
                  <span className="layer-item-label">Oil Slick</span>
                </label>

                <label className="layer-item-checkbox">
                  <input
                    type="checkbox"
                    checked={layers.vessels}
                    onChange={() => toggleLayer('vessels')}
                  />
                  <span className="layer-item-label">Relevant Vessels</span>
                </label>

                <div className="layers-popover-divider" />

                {/* Analytical / Investigation Overlays */}
                <label className="layer-item-checkbox">
                  <input
                    type="checkbox"
                    checked={layers.sourceRegion}
                    onChange={() => toggleLayer('sourceRegion')}
                  />
                  <span className="layer-item-label">Source Region</span>
                </label>

                <label className="layer-item-checkbox">
                  <input
                    type="checkbox"
                    checked={layers.vesselTracks}
                    onChange={() => toggleLayer('vesselTracks')}
                  />
                  <span className="layer-item-label">Vessel Tracks</span>
                </label>

                <label className="layer-item-checkbox">
                  <input
                    type="checkbox"
                    checked={layers.backtrack}
                    onChange={() => toggleLayer('backtrack')}
                  />
                  <span className="layer-item-label">Backtrack</span>
                </label>

                <label className="layer-item-checkbox">
                  <input
                    type="checkbox"
                    checked={layers.forecast}
                    onChange={() => toggleLayer('forecast')}
                  />
                  <span className="layer-item-label">Forecast</span>
                </label>

                <label className="layer-item-checkbox">
                  <input
                    type="checkbox"
                    checked={layers.wind}
                    onChange={() => toggleLayer('wind')}
                  />
                  <span className="layer-item-label">Wind</span>
                </label>

                <label className="layer-item-checkbox">
                  <input
                    type="checkbox"
                    checked={layers.current}
                    onChange={() => toggleLayer('current')}
                  />
                  <span className="layer-item-label">Current</span>
                </label>

                <label className="layer-item-checkbox">
                  <input
                    type="checkbox"
                    checked={layers.waves}
                    onChange={() => toggleLayer('waves')}
                  />
                  <span className="layer-item-label">Waves</span>
                </label>

                <label className="layer-item-checkbox">
                  <input
                    type="checkbox"
                    checked={layers.satellite}
                    onChange={() => toggleLayer('satellite')}
                  />
                  <span className="layer-item-label">Satellite</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optional MetOcean HUD (Only in tactical mode or if explicitly enabled) */}
      {!isOverview && environmentalData && (layers.wind || layers.current) && (
        <div className="tactical-env-hud">
          {layers.wind && (
            <div className="hud-metric-pill" style={{ color: '#38bdf8' }}>
              <Wind size={13} />
              <span>WIND: {environmentalData.wind?.speedKmh} km/h {environmentalData.wind?.directionText}</span>
            </div>
          )}
          {layers.current && (
            <div className="hud-metric-pill" style={{ color: '#34d399' }}>
              <Compass size={13} />
              <span>CURRENT: {environmentalData.oceanCurrent?.speedMs} m/s {environmentalData.oceanCurrent?.directionText}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeafletMap;
