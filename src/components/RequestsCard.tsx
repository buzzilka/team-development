import {
  Stack, 
  Typography, 
  Card, 
  Button 
} from "@mui/material";
import Request from "./Request";
import { useState } from "react";
import CreateRequest from "./CreateRequest";

const requests = [
  { startDate: "2024-02-01", endDate: "2024-02-05", status: "Одобрено" },
  { startDate: "2024-02-10", endDate: "2024-02-12", status: "На обработке" },
  { startDate: "2024-03-01", endDate: "2024-03-05", status: "Отклонена" },
] as const;

const RequestsCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", p: 3, boxShadow: 3 , mt: 1}}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Мои заявки
      </Typography>

      <Stack spacing={2}>
        {requests.map((req, index) => (
          <Request key={index} {...req} />
        ))}
      </Stack>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => setOpen(true)}
      >
        Создать заявку
      </Button>

      <CreateRequest open={open} onClose={() => setOpen(false)} />
    </Card>
  );
};

export default RequestsCard;
