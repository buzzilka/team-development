import {
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
import { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fetchRequest, updateRequest } from "../../api/studentEndpoints";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CenteredProgress = styled(CircularProgress)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 9999,
});

interface Request {
  confirmationType: "Medical" | "Family" | "Educational";
  dateFrom: string;
  dateTo?: string;
  files: File[];
}

interface RequestInfoProps {
  requestId: string;
  onClose: () => void;
}

const RequestInfo = ({ requestId, onClose }: RequestInfoProps) => {
  const [request, setRequest] = useState<Request | null>(null);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const response = await fetchRequest(requestId);
        setRequest(response);
        setExistingFiles(response.files || []);
      } catch (error) {
        console.log(error);
        setError("Ошибка загрузки данных");
      }
    };
    loadRequest();
  }, [requestId]);

  const handleEdit = () => {
    if (request?.confirmationType === "Educational") {
      setError("Заявку с типом 'Учебная' редактировать нельзя.");
      return;
    }
    setEditable(true);
  };

  const handleCancelEdit = () => {
    setEditable(false);
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const validFiles = newFiles.filter(
      (file) =>
        file.type.startsWith("image/") || file.type === "application/pdf"
    );
    if (validFiles.length !== newFiles.length) {
      setError("Можно прикрепить только файлы типа изображение или PDF.");
    }
    setFiles([...files, ...validFiles]);
  };

  const handleSubmit = async () => {
    if (!request?.dateFrom) {
      setError("Введите дату начала");
      return;
    }
    if (
      (request.confirmationType === "Family" ||
        request.confirmationType === "Educational") &&
      !request.dateTo
    ) {
      setError("Введите дату окончания");
      return;
    }
    if (
      (request.confirmationType === "Medical" ||
        request.confirmationType === "Educational") &&
      files.length === 0 &&
      existingFiles.length === 0
    ) {
      setError("Прикрепите хотя бы один файл");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("id", requestId);
    formData.append("DateFrom", request.dateFrom);
    if (request.dateTo) formData.append("DateTo", request.dateTo);
    formData.append("ConfirmationType", request.confirmationType);
    files.forEach((file) => formData.append("Files", file));

    try {
      await updateRequest(requestId, formData);
      onClose();
      window.location.reload();
    } catch (error) {
      console.log(error);
      setError("Ошибка при обновлении заявки.");
    } finally {
      setLoading(false);
    }
  };

  if (!request) return <CenteredProgress />;

  return (
    <>
      <DialogTitle>Детали заявки</DialogTitle>
      <DialogContent sx={{ minWidth: 500 }}>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Тип заявки"
            value={request.confirmationType}
            disabled
          >
            <MenuItem value="Medical">Больничный</MenuItem>
            <MenuItem value="Family">По семейным обстоятельствам</MenuItem>
            <MenuItem value="Educational">Учебная</MenuItem>
          </TextField>

          <TextField
            label="Дата начала"
            type="date"
            value={request.dateFrom.split("T")[0]}
            onChange={(e) =>
              setRequest({ ...request, dateFrom: e.target.value })
            }
            disabled={!editable}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          {request.confirmationType !== "Medical" && (
            <TextField
              label="Дата окончания"
              type="date"
              value={request.dateTo?.split("T")[0] || ""}
              onChange={(e) =>
                setRequest({ ...request, dateTo: e.target.value })
              }
              disabled={!editable}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          )}

          {existingFiles.length > 0 && (
            <Typography>
              Количество имеющихся файлов: {existingFiles.length} (при
              редактировании старые файлы будут удалены)
            </Typography>
          )}

          {editable && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button
                disableRipple
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
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
          )}

          {error && <Typography color="error">{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        {editable ? (
          <>
            <Button
              disableRipple
              onClick={handleCancelEdit}
              variant="outlined"
              color="error"
            >
              Отмена
            </Button>
            <Button
              disableRipple
              onClick={handleSubmit}
              variant="outlined"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Сохранить изменения"}
            </Button>
          </>
        ) : (
          <Button disableRipple onClick={handleEdit} variant="outlined">
            Редактировать
          </Button>
        )}
      </DialogActions>
    </>
  );
};

export default RequestInfo;
