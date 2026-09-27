import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchIncidents,
  fetchIncidentDetails,
  fetchEnvironmentalData,
  fetchVesselsData,
  fetchVesselHistory,
  fetchForecastData,
  fetchEvidenceData
} from '../services/api';

const IncidentContext = createContext(null);

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [activeIncidentId, setActiveIncidentId] = useState('INC-2026-001');
  const [activeIncident, setActiveIncident] = useState(null);
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [vessels, setVessels] = useState([]);
  const [vesselHistory, setVesselHistory] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulation states
  const [detectionState, setDetectionState] = useState('COMPLETED'); // IDLE | PROCESSING | COMPLETED
  const [hindcastState, setHindcastState] = useState('COMPLETED'); // IDLE | PROCESSING | COMPLETED

  // Timeline playback state (0 to 100 representing 10:00 UTC to 16:00 UTC + forecast horizon)
  const [timelineProgress, setTimelineProgress] = useState(70); // 70 is detection time ~14:32 UTC
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Chat drawer state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pendingChatQuery, setPendingChatQuery] = useState(null);

  // Load initial incidents list
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const list = await fetchIncidents();
        setIncidents(list);
      } catch (err) {
        console.error('Failed to load incidents list:', err);
        setError('Could not connect to maritime backend. Please verify server is running.');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // Load incident-specific data when activeIncidentId changes
  useEffect(() => {
    if (!activeIncidentId) return;

    const loadIncidentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [inc, env, vList, hist, fc, ev] = await Promise.all([
          fetchIncidentDetails(activeIncidentId),
          fetchEnvironmentalData(activeIncidentId),
          fetchVesselsData(activeIncidentId),
          fetchVesselHistory(activeIncidentId),
          fetchForecastData(activeIncidentId),
          fetchEvidenceData(activeIncidentId)
        ]);

        setActiveIncident(inc);
        setEnvironmentalData(env);
        setVessels(vList);
        setVesselHistory(hist);
        setForecast(fc);
        setEvidence(ev);
        if (vList && vList.length > 0) {
          setSelectedVessel(vList[0]);
        }
      } catch (err) {
        console.error('Failed to load incident detail data:', err);
        setError(`Failed to retrieve data for incident ${activeIncidentId}.`);
      } finally {
        setLoading(false);
      }
    };

    loadIncidentData();
  }, [activeIncidentId]);

  // Timeline playback interval loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return Math.min(100, prev + 0.5 * playbackSpeed);
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  const selectIncident = (id) => {
    setActiveIncidentId(id);
    setTimelineProgress(70);
    setIsPlaying(false);
    setDetectionState('COMPLETED');
    setHindcastState('COMPLETED');
  };

  const triggerChatWithQuestion = (question) => {
    setPendingChatQuery(question);
    setIsChatOpen(true);
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        activeIncidentId,
        selectIncident,
        activeIncident,
        environmentalData,
        vessels,
        vesselHistory,
        forecast,
        evidence,
        selectedVessel,
        setSelectedVessel,
        loading,
        error,
        detectionState,
        setDetectionState,
        hindcastState,
        setHindcastState,
        timelineProgress,
        setTimelineProgress,
        isPlaying,
        setIsPlaying,
        playbackSpeed,
        setPlaybackSpeed,
        isChatOpen,
        setIsChatOpen,
        pendingChatQuery,
        setPendingChatQuery,
        triggerChatWithQuestion
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncident must be used within an IncidentProvider');
  }
  return context;
};
