import apiClient from "./apiClient";

export const userInfo = async () => {
  const response = await apiClient.get(`/User/profile`);
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post(`/User/logout`);
  localStorage.clear();
  return response.data;
};
