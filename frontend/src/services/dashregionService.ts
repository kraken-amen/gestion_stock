import api from "./api";

export const getRegionKPIs = async (region: string) => {
    const response = await api.get(`/dash/kpis/${region}`);
    return response.data;
};

export const getRegionChartData = async (region: string) => {
    const response = await api.get(`/dash/chart/${region}`);
    return response.data;
};
export const getRegionAlerts = async (region: string) => {
    const response = await api.get(`/dash/alerts/${region}`);
    return response.data;
};  