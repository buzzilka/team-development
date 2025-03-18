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
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fetchRequest, updateRequest } from "../../api/studentEndpoints";
import { RequestInterface, Status } from "../../interfaces/RequestInterface";
import { VisuallyHiddenInput } from "../../styles/VisuallyHiddenInput";
import { CenteredProgress } from "../../styles/CentredProgress";
import { confirmRequest } from "../../api/adminEndpoints";
import { AxiosError } from "axios";
import { errorPopup, successPopup } from "../../styles/notifications";

const getFileType = (byteArray: Uint8Array): string => {
  const pdfSignature = [0x25, 0x50, 0x44, 0x46];
  const jpegSignature = [0xff, 0xd8, 0xff];
  const pngSignature = [0x89, 0x50, 0x4e, 0x47];

  if (
    byteArray
      .slice(0, pdfSignature.length)
      .every((byte, i) => byte === pdfSignature[i])
  ) {
    return "pdf";
  } else if (
    byteArray
      .slice(0, jpegSignature.length)
      .every((byte, i) => byte === jpegSignature[i])
  ) {
    return "jpg";
  } else if (
    byteArray
      .slice(0, pngSignature.length)
      .every((byte, i) => byte === pngSignature[i])
  ) {
    return "png";
  } else {
    return "unknown";
  }
};

interface RequestInfoProps {
  requestId: string;
  onClose: () => void;
  updateStatus: (id: string, status: Status) => void;
  updateInfo: (
    id: string,
    newDateFrom: string,
    newDateTo: string,
    status: Status
  ) => void;
}

const RequestInfo = ({
  requestId,
  onClose,
  updateStatus,
  updateInfo,
}: RequestInfoProps) => {
  const [request, setRequest] = useState<RequestInterface | null>(null);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const isSmallScreen = useMediaQuery("(max-width:630px)");

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const response = await fetchRequest(requestId);
        setRequest(response);
        setExistingFiles(response.files || []);
      } catch (error) {
        let errorMessage = "Произошла неизвестная ошибка";

        if (error instanceof AxiosError) {
          errorMessage =
            error.response?.data?.message || "Непредвиденная ошибка.";
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        errorPopup("Ошибка при получении заявки", errorMessage);
      }
    };
    loadRequest();
  }, [requestId]);

  const handleEdit = () => {
    if (
      request?.confirmationType === "Educational" &&
      !localStorage.getItem("roles")?.includes("Dean")
    ) {
      setError("Заявку с типом 'Учебная' может редактировать только деканат.");
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
      updateInfo(
        requestId,
        formData.get("DateFrom")!.toString(),
        formData.get("DateTo")!.toString(),
        "Pending"
      );
      successPopup("Заявка обновлена.");
    } catch (error) {
      let errorMessage = "Произошла неизвестная ошибка";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || "Непредвиденная ошибка.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorPopup("Ошибка при обновлении заявки", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRequset = async (id: string, requestStatus: Status) => {
    try {
      await confirmRequest({ requestId: id, status: requestStatus });
      updateStatus(id, requestStatus);
      onClose();
      successPopup("Статус заявки обновлен.");
    } catch (error) {
      let errorMessage = "Произошла неизвестная ошибка";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || "Непредвиденная ошибка.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorPopup("Ошибка при обновлении заявки", errorMessage);
    }
  };

  if (!request) return <CenteredProgress />;

  return (
    <>
      <DialogTitle>Детали заявки</DialogTitle>
      <DialogContent sx={{ minWidth: isSmallScreen ? "100%" : 500 }}>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Тип заявки"
            value={request.confirmationType}
            disabled
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
            <>
              <Typography>
                Количество имеющихся файлов: {existingFiles.length} (при
                редактировании старые файлы будут удалены)
              </Typography>
              <Button
                fullWidth={isSmallScreen}
                disableRipple
                variant="outlined"
                onClick={() => {
                  existingFiles.forEach((fileBase64, index) => {
                    try {
                      const byteCharacters = atob(fileBase64);

                      const byteArray = new Uint8Array(byteCharacters.length);
                      for (let i = 0; i < byteCharacters.length; i++) {
                        byteArray[i] = byteCharacters.charCodeAt(i);
                      }

                      const fileType = getFileType(byteArray);

                      const mimeTypes: Record<string, string> = {
                        pdf: "application/pdf",
                        jpg: "image/jpeg",
                        png: "image/png",
                        unknown: "application/octet-stream",
                      };

                      const blob = new Blob([byteArray], {
                        type: mimeTypes[fileType],
                      });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.download = `file_${index + 1}.${fileType}`;
                      link.click();
                    } catch (error) {
                      let errorMessage = "Произошла неизвестная ошибка";

                      if (error instanceof AxiosError) {
                        errorMessage =
                          error.response?.data?.message ||
                          "Непредвиденная ошибка.";
                      } else if (error instanceof Error) {
                        errorMessage = error.message;
                      }

                      errorPopup(
                        "Ошибка при скачивании файлов",
                        errorMessage
                      );
                      setError("Не удалось скачать файлы");
                    }
                  });
                }}
              >
                Скачать файлы
              </Button>
            </>
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
      <DialogActions
        sx={{
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "center",
          "& > *": { ml: isSmallScreen ? "0 !important" : "1" },
        }}
      >
        {editable ? (
          <>
            <Button
              disableRipple
              onClick={handleCancelEdit}
              variant="outlined"
              color="error"
              fullWidth={isSmallScreen}
              sx={{ mb: 1 }}
            >
              Отмена
            </Button>
            <Button
              disableRipple
              onClick={handleSubmit}
              variant="outlined"
              disabled={loading}
              fullWidth={isSmallScreen}
              sx={{ mb: 1 }}
            >
              {loading ? <CircularProgress size={24} /> : "Сохранить изменения"}
            </Button>
          </>
        ) : (
          <>
            {localStorage.getItem("roles")?.includes("Dean") && (
              <>
                <Button
                  disableRipple
                  variant="outlined"
                  color="success"
                  fullWidth={isSmallScreen}
                  onClick={() => handleConfirmRequset(request.id, "Approved")}
                  sx={{ mb: 1 }}
                >
                  Принять заявку
                </Button>
                <Button
                  disableRipple
                  variant="outlined"
                  color="error"
                  fullWidth={isSmallScreen}
                  onClick={() => handleConfirmRequset(request.id, "Rejected")}
                  sx={{ mb: 1 }}
                >
                  Отклонить заявку
                </Button>
              </>
            )}
            <Button
              disableRipple
              onClick={handleEdit}
              variant="outlined"
              fullWidth={isSmallScreen}
              sx={{ mb: 1 }}
            >
              Редактировать
            </Button>
          </>
        )}
      </DialogActions>
    </>
  );
};

export default RequestInfo;
