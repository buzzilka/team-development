import apiClient from "./apiClient";

//Ссылка на API не указана, так как в vite.config.ts указан proxy для локальной связи с сервером

export const loginUser = async (login: string, password: string) => {
  const response = await apiClient.post(`api/User/login`, {login, password});
  return response.data;
};

export const registerUser = async (name: string, login: string, password: string, role: string, group: string) => {
  const response = await apiClient.post(`api/User/register`, { name, login, password, role, group });
  return response.data;
};
