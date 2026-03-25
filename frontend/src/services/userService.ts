import api from './api';

export const getUsers = () => api.get('/auth/'); 

export const createUser = (userData: any) => api.post('/auth/create-user', userData);

export const updateUser = (_id: string,email: string, password: string, role?: string,region?: string) => api.put(`/auth/update-user/${_id}`, {email,password,role,region});

export const toggleUserStatus = (_id: string) => api.patch(`/auth/toggle-status/${_id}`);

export const deleteUser = (_id: string) => api.delete(`/auth/delete-user/${_id}`);