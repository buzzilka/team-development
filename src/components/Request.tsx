import { Card, Typography, Box, Dialog } from "@mui/material";
import { useState } from "react";

type Status = "Одобрено" | "На обработке" | "Отклонена";

interface RequestProps {
  startDate: string;
  endDate: string;
  status: Status;
}

const statusColors: Record<Status, string> = {
  "Одобрено": "#e8fcf4",
  "На обработке": "#fff7db",
  "Отклонена": "#fce8e8",
};

const statusColorsHover: Record<Status, string> = {
  "Одобрено": "#c5fce6",
  "На обработке": "#f7ecba",
  "Отклонена": "#f7baba",
};

const textStatusColors: Record<Status, string> = {
  "Одобрено": "#0a7649",
  "На обработке": "#c8a122",
  "Отклонена": "#c82d22",
};

const Request: React.FC<RequestProps> = ({ startDate, endDate, status }) => {
  const [open, setOpen] = useState(false);

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
          {startDate} - {endDate}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: textStatusColors[status], fontWeight: "bold" }}
        >
          {status}
        </Typography>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box p={3}>
          <Typography variant="h6">Детали заявки</Typography>
          <Typography>Дата начала: {startDate}</Typography>
          <Typography>Дата окончания: {endDate}</Typography>
          <Typography>Статус: {status}</Typography>
        </Box>
      </Dialog>
    </>
  );
};

export default Request;
