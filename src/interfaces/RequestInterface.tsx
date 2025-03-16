export type Status = "Pending" | "Approved" | "Rejected" ;

export type ConfirmationType = "Medical" | "Family" | "Educational";

export interface RequestInterface {
  status: Status;
  id: string;
  confirmationType: ConfirmationType;
  dateFrom: string;
  dateTo?: string;
  files?: File[];
  userName?: string;
}
