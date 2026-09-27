import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchIncidents = async () => {
  const res = await api.get('/incidents');
  return res.data;
};

export const fetchIncidentDetails = async (id) => {
  const res = await api.get(`/incidents/${id}`);
  return res.data;
};

export const fetchEnvironmentalData = async (id) => {
  const res = await api.get(`/incidents/${id}/environment`);
  return res.data;
};

export const fetchHindcastData = async (id) => {
  const res = await api.get(`/incidents/${id}/hindcast`);
  return res.data;
};

export const fetchVesselsData = async (id) => {
  const res = await api.get(`/incidents/${id}/vessels`);
  return res.data;
};

export const fetchVesselHistory = async (id) => {
  const res = await api.get(`/incidents/${id}/history`);
  return res.data;
};

export const fetchForecastData = async (id) => {
  const res = await api.get(`/incidents/${id}/forecast`);
  return res.data;
};

export const fetchEvidenceData = async (id) => {
  const res = await api.get(`/incidents/${id}/evidence`);
  return res.data;
};

export const sendChatMessage = async (message, incidentId) => {
  const res = await api.post('/chat', { message, incidentId });
  return res.data;
};

export default api;
