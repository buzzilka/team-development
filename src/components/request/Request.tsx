import { Card, Typography, Dialog } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import RequestInfo from "./RequsetInfo";

dayjs.locale("ru");

type Status = "Одобрено" | "На обработке" | "Отклонена";

interface RequestProps {
  id: string;
  dateFrom: Date;
  dateTo: Date;
  status: Status;
  confirmationType: string;
}

const statusColors: Record<Status, string> = {
  Одобрено: "#e8fcf4",
  "На обработке": "#fff7db",
  Отклонена: "#fce8e8",
};

const statusColorsHover: Record<Status, string> = {
  Одобрено: "#c5fce6",
  "На обработке": "#f7ecba",
  Отклонена: "#f7baba",
};

const textStatusColors: Record<Status, string> = {
  Одобрено: "#0a7649",
  "На обработке": "#c8a122",
  Отклонена: "#c82d22",
};

const Request = ({
  dateFrom,
  dateTo,
  status,
  confirmationType,
  id,
}: RequestProps) => {
  const [open, setOpen] = useState(false);

  const formattedDateFrom = dayjs(dateFrom).format("D MMMM YYYY");
  const formattedDateTo = dayjs(dateTo).format("D MMMM YYYY");

  return (
    <>
      <Card
        elevation={0}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: `${statusColors[status]}`,
          p: 2,
          cursor: "pointer",
          transition: "0.3s",
          "&:hover": { bgcolor: `${statusColorsHover[status]}` },
        }}
      >
        <Typography variant="h6">
          {formattedDateFrom} - {formattedDateTo}
        </Typography>

        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {confirmationType}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: textStatusColors[status], fontWeight: "bold" }}
        >
          {status}
        </Typography>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <RequestInfo requestId={id} onClose={() => setOpen(false)} />
      </Dialog>
    </>
  );
};

export default Request;
