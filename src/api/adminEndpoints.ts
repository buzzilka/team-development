import { Status } from "../interfaces/RequestInterface";
import apiClient from "./apiClient";

export const allUsers = async (params: {
  onlyConfirmed: boolean;
  onlyTheseRoles: string | string[];
  group: string;
  page: number;
  size: number;
}) => {
  const response = await apiClient.get(`/Admin/users`, {
    params: params,
  });
  return response.data;
};

export const confirmAccount = async (params: {
  userId: string;
  isConfirmed: boolean;
}) => {
  const response = await apiClient.put(`/Admin/confirm-account`, null, {
    params: params,
  });
  return response.data;
};

export const updateUserRole = async (id: string, roles: string[]) => {
  const response = await apiClient.put(`/Admin/role`, { id, roles });
  return response.data;
};

export const confirmRequest = async (params: {
  requestId: string;
  status: Status;
}) => {
  const response = await apiClient.put(`/Admin/confirm-request`, null, {
    params: params,
  });
  return response.data;
};

export const allRequests = async (params: {
  confirmationType: string;
  status: string;
  sort: string;
  userName: string;
  page: number;
  size: number;
}) => {
  const response = await apiClient.get(`/Request/all`, {
    params: params,
  });
  return response.data;
};

export const downloadRequests = async (params: {
  dateFrom: string;
  dateTo: string;
}) => {
  const response = await apiClient.get(`/Admin/download-requests`, {
    responseType: "blob",
    params: params,
  });
  return response.data;
};

export const updateUserGroup = async (params: {
  userId: string;
  newGroup: string;
}) => {
  const response = await apiClient.put(`/Admin/changeGroup`, null, {
    params: params,
  });
  return response.data;
};
