import api from './api';

export const getRoles = async (): Promise<string[]> => {
  const res = await api.get('/roles'); 
  return res.data; //["admin", "responsable_region", "user"]
};