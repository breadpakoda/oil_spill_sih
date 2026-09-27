import React from 'react';
import { Play, Pause, RotateCcw, FastForward, SkipBack, SkipForward, Clock } from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

const TimelineBar = () => {
  const {
    timelineProgress,
    setTimelineProgress,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    activeIncident
  } = useIncident();

  // Convert progress (0 to 100) to display simulated time
  // 0 -> 10:00 UTC (Pre-incident transit)
  // 35 -> 12:15 UTC (Release window)
  // 70 -> 14:32 UTC (Satellite Detection)
  // 100 -> +24h Forecast Horizon
  const getDisplayTimeAndPhase = (val) => {
    if (val < 25) {
      return {
        time: '10:30 UTC',
        phase: 'Pre-Discharge AIS Vessel Ingress',
        color: '#60a5fa'
      };
    } else if (val < 50) {
      return {
        time: '12:20 UTC',
        phase: 'Estimated Oil Release Window (Source Region)',
        color: '#f59e0b'
      };
    } else if (val < 75) {
      return {
        time: '14:32 UTC',
        phase: 'Sentinel-1 SAR Detection Point',
        color: '#00f0ff'
      };
    } else {
      return {
        time: '+24h Horizon',
        phase: 'Lagrangian Forward Spill Drift Forecast',
        color: '#ec4899'
      };
    }
  };

  const currentStatus = getDisplayTimeAndPhase(timelineProgress);

  return (
    <div className="timeline-bar">
      {/* Play / Step Controls */}
      <div className="timeline-controls">
        <button
          onClick={() => setTimelineProgress(0)}
          className="btn btn-secondary btn-sm"
          title="Reset to Beginning (10:00 UTC)"
        >
          <RotateCcw size={14} />
        </button>

        <button
          onClick={() => setTimelineProgress(prev => Math.max(0, prev - 10))}
          className="btn btn-secondary btn-sm"
          title="Step Backward"
        >
          <SkipBack size={14} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`btn btn-sm ${isPlaying ? 'btn-danger-outline' : 'btn-primary'}`}
          style={{ minWidth: '95px' }}
        >
          {isPlaying ? (
            <>
              <Pause size={14} />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play size={14} />
              <span>PLAY</span>
            </>
          )}
        </button>

        <button
          onClick={() => setTimelineProgress(prev => Math.min(100, prev + 10))}
          className="btn btn-secondary btn-sm"
          title="Step Forward"
        >
          <SkipForward size={14} />
        </button>
      </div>

      {/* Scrubber & Slider */}
      <div className="timeline-scrubber">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={13} className="text-cyan" />
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: currentStatus.color }}>
              {currentStatus.time}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              {currentStatus.phase}
            </span>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            SIMULATION PROGRESS: {Math.round(timelineProgress)}%
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={timelineProgress}
          onChange={(e) => setTimelineProgress(parseFloat(e.target.value))}
          className="timeline-slider"
        />

        <div className="timeline-markers">
          <span onClick={() => setTimelineProgress(0)} style={{ cursor: 'pointer' }}>
            10:00 UTC (Transit)
          </span>
          <span onClick={() => setTimelineProgress(35)} style={{ cursor: 'pointer', color: '#f59e0b' }}>
            12:15 UTC (Release Window)
          </span>
          <span onClick={() => setTimelineProgress(70)} style={{ cursor: 'pointer', color: '#00f0ff', fontWeight: 700 }}>
            14:32 UTC (SAR Detection)
          </span>
          <span onClick={() => setTimelineProgress(100)} style={{ cursor: 'pointer', color: '#ec4899' }}>
            +24h (Shoreline Impact Forecast)
          </span>
        </div>
      </div>

      {/* Speed Multiplier (1x, 2x, 4x) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {[1, 2, 4].map((spd) => (
          <button
            key={spd}
            onClick={() => setPlaybackSpeed(spd)}
            className={`btn btn-sm ${playbackSpeed === spd ? 'btn-cyan-outline' : 'btn-secondary'}`}
            style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}
          >
            {spd}x
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimelineBar;
