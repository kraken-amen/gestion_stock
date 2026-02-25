import api from './api'; 

export const getRoles = async () => {
  const res = await api.get('/roles'); 
  return res.data;
};