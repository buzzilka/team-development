import axios from "axios";

export const loginUser = async (login: string, password: string) => {
  const response = await axios.post(`api/User/login`, {login, password },{ headers: {
    'Content-Type': 'application/json',
  }});
  return response.data;
};

export const registerUser = async (name: string, login: string, password: string, role: string, group: string) => {
  const response = await axios.post(`api/User/register`, { name, login, password, role, group }, { headers: {
    'Content-Type': 'application/json',
  }});
  return response.data;
};


