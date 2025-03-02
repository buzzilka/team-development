import axios from "axios";

//Ссылка на API не указана, так как в vite.config.ts указан proxy для связи с сервером

export const loginUser = async (login: string, password: string) => {
  const response = await axios.post(`api/User/login`, {login, password },{ headers: {
    'Content-Type': 'application/json',
  }});
  return response.data;
};

export const registerUser = async (name: string, login: string, password: string) => {
  const response = await axios.post(`api/User/register`, { name, login, password }, { headers: {
    'Content-Type': 'application/json',
  }});
  return response.data;
};
