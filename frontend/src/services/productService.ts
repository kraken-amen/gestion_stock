import api from './api';

export const getProducts = () => api.get('/product/'); 

export const createProduct = (productData: any) => api.post('/product/', productData);

export const updateProduct = (_id: string,codeArticle: string, libelle: string, quantite: number, unite: string, prix: number) => api.put(`/product/${_id}`, {codeArticle,libelle,quantite,unite,prix});

export const deleteProduct = (_id: string) => api.delete(`/product/${_id}`);