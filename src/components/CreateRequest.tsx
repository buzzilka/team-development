import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    IconButton,
  } from "@mui/material";
  import { useState } from "react";
  import AttachFileIcon from "@mui/icons-material/AttachFile";
  
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
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                style={{ display: "none" }}
                id="file-input"
                onChange={handleFileChange}
              />
              <label htmlFor="file-input">
                <IconButton component="span">
                  <AttachFileIcon />
                </IconButton>
              </label>
              <span>{file ? file.name : "Прикрепите файл "}</span>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Отправить заявку
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default CreateRequest;
  