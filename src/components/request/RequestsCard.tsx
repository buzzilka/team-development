import { Stack, Typography, Card, Button, Box } from "@mui/material";
import Request from "./Request";
import { useState } from "react";
import CreateRequest from "./CreateRequest";

interface RequestData {
  id: string;
  dateFrom: Date;
  dateTo: Date;
  status: string;
  confirmationType: string;
}

interface RequestsCardProps {
  requests: RequestData[];
}

const statusMap: Record<string, "Одобрено" | "На обработке" | "Отклонена"> = {
  Approved: "Одобрено",
  Pending: "На обработке",
  Rejected: "Отклонена",
};

const typeMap: Record<string, "По семейным обстоятельствам" | "Больничный" | "Учебная"> = {
  Medical: "Больничный",
  Family: "По семейным обстоятельствам",
  Educational: "Учебная"
}

const RequestsCard = ({ requests }: RequestsCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Card elevation={0} sx={{ maxWidth: 800, mx: "auto", p: 3, mt: 1 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Мои заявки
      </Typography>

      {requests.length > 0 ? (
        <Stack spacing={2}>
          {requests.map((req, index) => (
            <Request
              key={index}
              id={req.id}
              dateFrom={req.dateFrom} 
              dateTo={req.dateTo}
              status={statusMap[req.status]}
              confirmationType={typeMap[req.confirmationType]}
            />
          ))}
        </Stack>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={100}
        >
          <Typography variant="body2" fontSize="20px">У вас пока нет заявок😎</Typography>
        </Box>
      )}

      <Button
        disableRipple
        variant="outlined"
        color="primary"
        fullWidth
        sx={{
          mt: 3,
          border: "none",
          fontWeight: "bold",
          color: "#0060e6",
          bgcolor: "#e8f2fc",
          "&:hover": {
            bgcolor: "#bad9f7",
          },
        }}
        onClick={() => setOpen(true)}
      >
        Создать заявку
      </Button>

      <CreateRequest open={open} onClose={() => setOpen(false)} />
    </Card>
  );
};

export default RequestsCard;
