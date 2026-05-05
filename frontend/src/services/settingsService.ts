import api from "./api";

export const getSettings = () => api.get("/settings");
export const updateSettings = (data:any) => api.put("/settings", data);