import api from "./api";

export const getMovements = async () => {
    try {
        const response = await api.get('/movement');
        return response.data; 
    } catch (error) {
        console.error("Erreur lors de la récupération des mouvements:", error);
        throw error;
    }
}