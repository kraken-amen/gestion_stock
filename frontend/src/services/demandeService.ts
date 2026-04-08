import api from "./api";
import type { Demande } from "../types";

export const getDemandes = async (): Promise<Demande[]> => {
    const response = await api.get<any>('/demande');
    
    if (response.data._id && Array.isArray(response.data._id)) {
        return response.data._id;
    }
    
    if (Array.isArray(response.data)) {
        return response.data;
    }

    return response.data.demandes || []; 
};
export const getDemandeById = async (id: string): Promise<Demande> => {
    const response = await api.get<Demande>(`/demande/${id}`);
    return response.data;
};
export const createDemande = async (demande: Demande): Promise<Demande> => {
    const response = await api.post<Demande>('/demande/create', demande);
    return response.data;
};
export const updateDemande = async (id: string, demande: Demande): Promise<Demande> => {
    const response = await api.put<Demande>(`/demande/${id}`, demande);
    return response.data;
};
export const deleteDemande = async (id: string): Promise<void> => {
    await api.delete(`/demande/${id}`);
    return;
};
export const approveDemande = async (id: string): Promise<void> => {
    await api.patch(`/demande/approve/${id}`);
    return;
};
export const rejectDemande = async (id: string): Promise<void> => {
    await api.patch(`/demande/reject/${id}`);
    return;
};
