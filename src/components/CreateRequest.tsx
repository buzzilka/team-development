import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

interface CreateRequestProps {
  open: boolean;
  onClose: () => void;
}

const CreateRequest: React.FC<CreateRequestProps> = ({ open, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    console.log({ startDate, endDate, description, file });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Создать заявку</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Дата начала"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="Дата окончания"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <TextField
            label="Описание (необязательно)"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
                "&:hover": {
                  bgcolor: " #bad9f7",
                },
              }}
            >
              Загрузить файл
              <VisuallyHiddenInput
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={handleFileChange}
              />
            </Button>
            <span>{file ? file.name : "Файл не выбран"}</span>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disableRipple
          onClick={onClose}
          variant="outlined"
          sx={{
            border: "none",
            color: "#c82d22",
            bgcolor: "#fce8e8",
            "&:hover": {
              bgcolor: " #f7baba",
            },
          }}
        >
          Отмена
        </Button>
        <Button
          disableRipple
          onClick={handleSubmit}
          variant="outlined"
          sx={{
            border: "none",
            color: "#0060e6",
            bgcolor: "#e8f2fc",
            "&:hover": {
              bgcolor: " #bad9f7",
            },
          }}
        >
          Отправить заявку
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRequest;
