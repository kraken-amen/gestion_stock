import type { LoginResponse } from '../types/index';
import api from './api';

// --- LOGIN ---
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  //http://localhost:5000/api
  const response = await api.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
};