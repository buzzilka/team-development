import { Box, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { downloadRequests } from "../../api/adminEndpoints";
import { errorPopup, infoPopup } from "../../styles/notifications";
import { AxiosError } from "axios";

const RequestsDownload = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const previousMonthDate = new Date(currentDate);
    previousMonthDate.setMonth(currentDate.getMonth() - 1);

    setDateFrom(previousMonthDate.toISOString().split("T")[0]);
    setDateTo(currentDate.toISOString().split("T")[0]);
  }, []);

  const formatDateTime = (date: string) => {
    return new Date(date).toISOString();
  };

  const handleDownload = async () => {
    if (new Date(dateFrom) > new Date(dateTo)) {
      infoPopup("Дата начала не может быть позже даты конца.");
      return;
    }
    const params = {
      dateFrom: formatDateTime(dateFrom),
      dateTo: formatDateTime(dateTo),
    };
    try {
      const blob = await downloadRequests(params);

      const url = window.URL.createObjectURL(blob);
      const filename = "requests.xlsx";

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      let errorMessage = "Произошла неизвестная ошибка";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || "Непредвиденная ошибка.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorPopup("Ошибка выгрузки", errorMessage);
    }
  };

  return (
    <Box mt={2}>
      <TextField
        label="Дата начала выгрузки"
        type="date"
        fullWidth
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Дата конца выгрузки"
        type="date"
        fullWidth
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <Button
        disableRipple
        fullWidth
        variant="outlined"
        color="primary"
        onClick={handleDownload}
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
      >
        Выгрузка
      </Button>
    </Box>
  );
};

export default RequestsDownload;
