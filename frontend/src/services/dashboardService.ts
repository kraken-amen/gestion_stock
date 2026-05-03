import api from './api';

// --- DASHBOARD GLOBAL SERVICES ---

export const getKpiStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getStockByRegion = async () => {
  const response = await api.get('/dashboard/stock-by-region');
  return response.data;
};

export const getStockEvolution = async () => {
  const response = await api.get('/dashboard/stock-evolution');
  return response.data;
};

export const getStatutsStats = async () => {
  const response = await api.get('/dashboard/status-stats');
  return response.data;
};

export const getTopProducts = async () => {
  const response = await api.get('/dashboard/top-products');
  return response.data;
};

export const getActiveAlerts = async () => {
  const response = await api.get('/dashboard/alerts');
  return response.data;
};

export const getRecentDemandes = async () => {
  const response = await api.get('/dashboard/recent');
  return response.data;
};

export const getRecentCommandes = async () => {
  const response = await api.get('/dashboard/recent-commandes');
  return response.data;
};

export const getRecentMovements = async () => {
  const response = await api.get('/dashboard/history');
  return response.data;
};