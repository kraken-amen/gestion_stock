import type { DashboardResponse } from '../types/index';
import api from './api';

// --- DASHBOARD ---
export const getDashboard = async (): Promise<DashboardResponse> => {
  //http://localhost:5000/api
  const response = await api.get<DashboardResponse>('/stock/dashboard');
  return response.data;
};