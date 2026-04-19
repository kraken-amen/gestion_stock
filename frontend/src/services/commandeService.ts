import api from "./api";
export const getCommandes = async () => {
        const response = await api.get(`/commande`);
        return response.data;
};
export const createCommande = async (commande: any) => {
        const response = await api.post(`/commande`, commande);
        return response.data;
};
export const deleteCommande = async (id: string) => {
        const response = await api.delete(`/commande/${id}`);
        return response.data;
};
// export const updateCommande = async (id: string, commande: any) => {
//         const response = await api.put(`/commande/${id}`, commande);
//         return response.data;
// };