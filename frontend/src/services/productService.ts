import api from './api';

export const getProducts = async () => {
    const response = await api.get('/product/');
    return response.data;
};

export const getAllProducts = () => api.get('/product/').then(res => res.data);

export const createProduct = (productData: any) => api.post('/product/', productData);

export const updateProduct = (_id: string, productData: any) => api.put(`/product/${_id}`, productData);

export const deleteProduct = (_id: string) => api.delete(`/product/${_id}`);