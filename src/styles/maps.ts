import { ConfirmationType, Status } from "../interfaces/RequestInterface";

export const statusMap: Record<Status, string> = {
  Approved: "Одобрено",
  Pending: "На обработке",
  Rejected: "Отклонена",
};

export const typeMap: Record<ConfirmationType, string> = {
  Medical: "Больничный",
  Family: "По семейным обстоятельствам",
  Educational: "Учебная",
};

export const rolesMap: Record<string, string> = {
  Student: "Студент",
  Teacher: "Преподаватель",
  Dean: "Деканат",
};
