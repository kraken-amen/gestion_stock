import api from "./api";
export const getCommandes = async () => {
        const response = await api.get(`/commande`);
        return response.data;
};