import api from "./api";

export const getNotifications = async () => {
  const res = await api.get("/notif");
  return res.data;
};

export const markAsRead = async (id: string) => {
  return await api.patch(`/notif/read/${id}`);
};

export const markAllAsRead = async () => {
  return await api.patch(`/notif/read-all`);
};

export const deleteNotification = async (id: string) => {
  return await api.delete(`/notif/${id}`);
};