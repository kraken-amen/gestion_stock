import api from "./api";

export const getSettings = async () => {
  const res = await api.get("/settings");
  return res.data;
};
export const updateSettings = async (data: any) => {
  const res = await api.put("/settings", data);
  return res.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const token = localStorage.getItem("token");

  const res = await api.put(
    "/auth/change-password",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};
export const deleteAllDemandes = () => api.delete("/demande");
export const deleteAllNotif = () => api.delete("/notif");