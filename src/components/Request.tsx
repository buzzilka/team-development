import {
  Card, 
  Typography, 
  Box, 
  Dialog 
} from "@mui/material";
import { useState } from "react";

type Status = "Одобрено" | "На обработке" | "Отклонена";

interface RequestProps {
  startDate: string;
  endDate: string;
  status: Status;
}

const statusColors: Record<Status, string> = {
  "Одобрено": "green",
  "На обработке": "orange",
  "Отклонена": "red",
};

const Request: React.FC<RequestProps> = ({ startDate, endDate, status }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        sx={{
          border: `2px solid ${statusColors[status]}`,
          p: 2,
          cursor: "pointer",
          transition: "0.3s",
          "&:hover": { boxShadow: 3 },
        }}
      >
        <Typography variant="h6">
          {startDate} - {endDate}
        </Typography>
        <Typography variant="body2" sx={{ color: statusColors[status] }}>
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
