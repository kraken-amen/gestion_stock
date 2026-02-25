import axios from 'axios';
import type { LoginResponse } from '../types/index';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  // Axios sends the request to the server
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
  
  // VS Code suggests (role, email, isActive)
  return response.data;
};