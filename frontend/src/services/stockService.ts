import api from './api';

// ─── GET ALL ─────────────────────────────

export const getStocks = () => api.get('/stock/');

export const getAllStocks = async () => {
  const response = await api.get('/stock/');
  return response.data;
};

// ─── GET BY ID ───────────────────────────

export const getStockById = (_id: string) =>
  api.get(`/stock/${_id}`);

// ─── GET BY REGION ───────────────────────

export const getStockByRegion = async (region: string) => {
  const response = await api.get(`/stock/region/${region}`);
  return response.data;
};

// ─── CREATE ─────────────────────────────

export const createStock = (stockData: any) =>
  api.post('/stock/', stockData);

// ─── UPDATE ─────────────────────────────

export const updateStock = (_id: string, stockData: any) =>
  api.put(`/stock/${_id}`, stockData);

// ─── DELETE ─────────────────────────────

export const deleteStock = (_id: string) =>
  api.delete(`/stock/${_id}`);
//us4
export const registerStock = (_id: string) =>
  api.patch(`/stock/register/${_id}`);