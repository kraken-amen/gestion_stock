import api from "./api";
export const getConfirmReceipts = async () => {
        const response = await api.get(`/confirm-receipt`);
        return response.data;
};
// 2. Confirm receipt (Admin only)
export const confirmReceipt = async (livraisonId: string) => {
        // PATCH /confirm-receipt/:livraisonId
        const response = await api.patch(
            `/confirm-receipt/${livraisonId}`, 
            {},
        );
        return response.data;
    }
// 3. Toggle registered status (Responsable Région only)
// This updates the stock status in the warehouse (dépôt)
export const toggleEnregistered = async (stockId: string) => {
        // PATCH /enregistered/:stockId
        const response = await api.patch(
            `/enregistered/${stockId}`, 
            {}, 
            
        );
        return response.data;
};