import api from "./api";

export const getRegionKPIs = async (regionName: string) => {
    const response = await api.get(`/dash/kpis/${regionName}`);
    return response.data;
};

export const getRegionChartData = async (regionName: string) => {
    const response = await api.get(`/dash/chart/${regionName}`);
    return response.data;
};
export const getRegionAlerts = async (regionName: string) => {
    const response = await api.get(`/dash/alerts/${regionName}`);
    return response.data;
};  