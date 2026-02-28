import api from './api';

export const getUsers = () => api.get('/auth/users'); 

export const createUser = (userData: any) => api.post('/auth/create-user', userData);

export const updateUser = (email: string, data: any) => api.put(`/auth/update-user/${email}`, data);

export const toggleUserStatus = (email: string) => api.patch(`/auth/toggle-status/${email}`);