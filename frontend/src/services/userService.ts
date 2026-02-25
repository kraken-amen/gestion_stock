import api from './api';

export const getUsers = () => api.get('/users'); 

export const createUser = (userData: any) => api.post('/create-user', userData);

export const updateUser = (email: string, data: any) => api.put(`/update-user/${email}`, data);

export const toggleUserStatus = (email: string) => api.patch(`/toggle-status/${email}`);