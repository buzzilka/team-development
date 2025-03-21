import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fetchRequest, uploadRequest } from "../../api/studentEndpoints";
import {
  ConfirmationType,
  RequestInterface,
} from "../../interfaces/RequestInterface";
import { VisuallyHiddenInput } from "../../styles/VisuallyHiddenInput";
import { AxiosError } from "axios";
import { errorPopup, successPopup } from "../../styles/notifications";

interface CreateRequestProps {
  open: boolean;
  onClose: () => void;
  onRequestCreated: (newRequest: RequestInterface) => void;
}

const CreateRequest = ({
  open,
  onClose,
  onRequestCreated,
}: CreateRequestProps) => {
  const [type, setType] = useState<ConfirmationType>("Medical");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as ConfirmationType);
    setError("");
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
    setError("");
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
    setError("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          file.type.startsWith("image/") || file.type === "application/pdf"
      );

      if (validFiles.length !== selectedFiles.length) {
        setError("Можно прикрепить только файлы изображений или PDF.");
        return;
      }
      setFiles(Array.from(selectedFiles));
    }
    setError("");
  };

  const validateForm = () => {
    if (!type) {
      setError("Выберите тип заявки");
      return false;
    }
    if (!startDate) {
      setError("Введите дату начала");
      return false;
    }
    if ((type === "Family" || type === "Educational") && !endDate) {
      setError("Введите дату окончания");
      return false;
    }
    if ((type === "Medical" || type === "Educational") && files.length === 0) {
      setError("Прикрепите хотя бы один файл");
      return false;
    }
    if (files.length > 5) {
      setError("Нельзя прикрепить больше 5 файлов");
      return false;
    }
    if (startDate > endDate && type !== "Medical") {
      setError("Дата начала не может быть позже даты окончания.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("DateFrom", startDate);
    if (endDate) formData.append("DateTo", endDate);
    if (type) formData.append("ConfirmationType", type);
    files.forEach((file) => formData.append("Files", file));

    try {
      const response = await uploadRequest(formData);

      const newRequest = await fetchRequest(response.id);

      onRequestCreated(newRequest);

      onClose();

      setFiles([]);

      successPopup("Заявка создана.");
    } catch (error) {
      let errorMessage = "Произошла неизвестная ошибка";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || "Непредвиденная ошибка.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorPopup("Ошибка при отправке заявки", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Создать заявку</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Тип заявки"
            value={type}
            onChange={handleTypeChange}
          >
            <MenuItem disableRipple value="Medical">
              Больничный
            </MenuItem>
            <MenuItem disableRipple value="Family">
              По семейным обстоятельствам
            </MenuItem>
            <MenuItem disableRipple value="Educational">
              Учебная
            </MenuItem>
          </TextField>

          <TextField
            label="Дата начала"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          <TextField
            label={
              type === "Medical"
                ? "Дата окончания (необязательно)"
                : "Дата окончания"
            }
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              disableRipple
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                border: "none",
                color: "#0060e6",
                bgcolor: "#e8f2fc",
                "&:hover": { bgcolor: " #bad9f7" },
              }}
            >
              Загрузить файлы
              <VisuallyHiddenInput
                type="file"
                accept=".pdf,.jpg,.png"
                multiple
                onChange={handleFileChange}
              />
            </Button>
            <span>
              {files.length > 0
                ? `${files.length} файл(ов) выбрано`
                : "Файл не выбран"}
            </span>
          </Stack>

          {type === "Family" && (
            <Typography>
              Для этой заявки файл не является обязательным, но если
              подтверждающего файла нет, нужно явиться в деканат для написания
              заявления.
            </Typography>
          )}

          {error && <Typography color="error">{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disableRipple
          onClick={() => {
            onClose();
            setFiles([]);
          }}
          variant="outlined"
          sx={{
            border: "none",
            color: "#c82d22",
            bgcolor: "#fce8e8",
            "&:hover": { bgcolor: " #f7baba" },
          }}
        >
          Отмена
        </Button>
        <Button
          disableRipple
          onClick={handleSubmit}
          variant="outlined"
          disabled={loading}
          sx={{
            border: "none",
            color: "#0060e6",
            bgcolor: "#e8f2fc",
            "&:hover": { bgcolor: " #bad9f7" },
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Отправить заявку"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRequest;
