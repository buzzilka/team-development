import {
  Stack,
  Typography,
  Card,
  Button,
  Box,
  TextField,
  MenuItem,
  Select,
  Pagination,
} from "@mui/material";
import Request from "./Request";
import { useEffect, useState } from "react";
import CreateRequest from "./CreateRequest";
import { RequestInterface, Status } from "../../interfaces/RequestInterface";
import { allRequests } from "../../api/adminEndpoints";
import { CenteredProgress } from "../../styles/CentredProgress";
import { requestsInfo } from "../../api/studentEndpoints";
import { AxiosError } from "axios";
import { errorPopup } from "../../styles/notifications";

interface RequestsCardProps {
  role: string;
}

const RequestsCard = ({ role }: RequestsCardProps) => {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<RequestInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean | null>(null);
  const [confirmationType, setConfirmationType] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [student, setStudent] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      const params = {
        confirmationType: confirmationType,
        status: status,
        sort: sort,
        userName: student,
        page,
        size: pageSize,
      };

      try {
        let response;
        if (role === "Dean") {
          response = await allRequests(params);
          setRequests(
            response.value.requests.listLightRequests.map(
              (req: RequestInterface) => ({
                id: req.id,
                dateFrom: req.dateFrom,
                dateTo: req.dateTo,
                status: req.status,
                confirmationType: req.confirmationType,
                userName: req.userName,
              })
            )
          );
          setTotalPages(response.value.pagination.count);
        } else if (role === "Student") {
          response = await requestsInfo(params);
          setRequests(
            response.requests.listLightRequests.map(
              (req: RequestInterface) => ({
                id: req.id,
                dateFrom: req.dateFrom,
                dateTo: req.dateTo,
                status: req.status,
                confirmationType: req.confirmationType,
                userName: req.userName,
              })
            )
          );
          setTotalPages(response.pagination.count);
        }
      } catch (error) {
        let errorMessage = "Произошла неизвестная ошибка";

        if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.message || "Непредвиденная ошибка.";
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        errorPopup("Ошибка при получении заявок", errorMessage);
        setError(true)
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [role, confirmationType, status, sort, student, page, pageSize]);

  if (loading) return <CenteredProgress />;
  if (error) return <Typography color="error">Что-то пошло не так 😭</Typography>;

  const updateRequestStatus = (requestId: string, newStatus: Status) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const updateRequestInfo = (
    requestId: string,
    newDateFrom: string,
    newDateTo: string,
    status: Status
  ) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId
          ? { ...req, dateFrom: newDateFrom, dateTo: newDateTo, status: status }
          : req
      )
    );
  };

  const updateRequests = (newRequest: RequestInterface) => {
    setRequests((prevRequests) => [...prevRequests, newRequest]);
  };

  return (
    <Card elevation={0} sx={{ maxWidth: 800, mx: "auto", mt: 1 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Фильтры
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} mb={2} mt={1}>
        <Select
          displayEmpty
          value={confirmationType}
          onChange={(e) => setConfirmationType(e.target.value)}
        >
          <MenuItem disableRipple value="">
            Все типы
          </MenuItem>
          <MenuItem disableRipple value="Medical">
            Больничный
          </MenuItem>
          <MenuItem disableRipple value="Family">
            По семейным обстоятельствам
          </MenuItem>
          <MenuItem disableRipple value="Educational">
            Учебная
          </MenuItem>
        </Select>
        <Select
          displayEmpty
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem disableRipple value="">
            Все статусы
          </MenuItem>
          <MenuItem disableRipple value="Pending">
            На обработке
          </MenuItem>
          <MenuItem disableRipple value="Approved">
            Одобрено
          </MenuItem>
          <MenuItem disableRipple value="Rejected">
            Отклонено
          </MenuItem>
        </Select>
        <Select
          displayEmpty
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <MenuItem disableRipple value="">
            Без сортировки
          </MenuItem>
          <MenuItem disableRipple value="CreatedAsc">
            Дата создания: сначала старые
          </MenuItem>
          <MenuItem disableRipple value="CreatedDesc">
            Дата создания: сначала старые
          </MenuItem>
        </Select>
        {role === "Dean" && (
          <TextField
            label="Имя студента"
            value={student}
            onChange={(e) => setStudent(e.target.value)}
            variant="outlined"
          />
        )}
      </Box>

      {role == "Student" && (
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Мои заявки
        </Typography>
      )}

      {role == "Dean" && (
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Все заявки
        </Typography>
      )}

      {requests.length > 0 ? (
        <Stack spacing={2}>
          {requests.map((req, index) => (
            <Request
              key={index}
              id={req.id}
              dateFrom={req.dateFrom}
              dateTo={req.dateTo}
              status={req.status}
              confirmationType={req.confirmationType}
              userName={req.userName}
              updateStatus={updateRequestStatus}
              updateInfo={updateRequestInfo}
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
          <Typography variant="body2" fontSize="20px">
            У вас пока нет заявок😎
          </Typography>
        </Box>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          size="small"
        >
          <MenuItem disableRipple value={5}>
            5
          </MenuItem>
          <MenuItem disableRipple value={10}>
            10
          </MenuItem>
          <MenuItem disableRipple value={20}>
            20
          </MenuItem>
        </Select>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {role == "Student" && (
        <>
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

          <CreateRequest open={open} onClose={() => setOpen(false)}  onRequestCreated={updateRequests}/>
        </>
      )}
    </Card>
  );
};

export default RequestsCard;
