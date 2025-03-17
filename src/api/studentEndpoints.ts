import apiClient from "./apiClient";

export const requestsInfo = async (params: {
  confirmationType: string;
  status: string;
  sort: string;
  page: number;
  size: number;
}) => {
  const response = await apiClient.get(`/User/requests`, { params: params });
  return response.data;
};

export const uploadRequest = async (data: FormData) => {
  const response = await apiClient.post("/Request/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const fetchRequest = async (requestId: string) => {
  const response = await apiClient.get(`/Request/${requestId}`);
  return response.data;
};

export const updateRequest = async (requestId: string, data: FormData) => {
  const response = await apiClient.put(`/Request/update/${requestId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
