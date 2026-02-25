import api from './api';

export const getUsers = () => api.get('/users');

export const createUser = (userData: any) => api.post('/create-user', userData);

export const updateUser = (id: string, data: any) => api.put(`/update-user/${id}`, data);

export const toggleUserStatus = (id: string) => api.patch(`/toggle-status/${id}`);