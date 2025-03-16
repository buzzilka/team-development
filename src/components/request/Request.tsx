import { Card, Typography, Dialog } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import RequestInfo from "./RequsetInfo";
import { RequestInterface, Status } from "../../interfaces/RequestInterface";
import { statusMap, typeMap } from "../../styles/maps";
import {
  statusColors,
  statusColorsHover,
  textColors,
} from "../../styles/colors";

dayjs.locale("ru");

const Request = ({
  dateFrom,
  dateTo,
  status,
  confirmationType,
  id,
  userName,
  updateStatus,
  updateInfo,
}: RequestInterface & {
  updateStatus: (requestId: string, newStatus: Status) => void;

  updateInfo: (
    requestId: string,
    newDateFrom: string,
    newDateTo: string,
    status: Status
  ) => void;
}) => {
  const [open, setOpen] = useState(false);

  const formattedDateFrom = dayjs(dateFrom).format("D MMMM YYYY");
  const formattedDateTo = dayjs(dateTo).format("D MMMM YYYY");

  return (
    <>
      <Card
        elevation={0}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: `${statusColors[statusMap[status]]}`,
          p: 2,
          cursor: "pointer",
          transition: "0.3s",
          "&:hover": { bgcolor: `${statusColorsHover[statusMap[status]]}` },
        }}
      >
        <Typography variant="h6">
          {formattedDateFrom} - {formattedDateTo}
        </Typography>

        {userName && (
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {userName}
          </Typography>
        )}

        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {typeMap[confirmationType]}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: textColors[statusMap[status]], fontWeight: "bold" }}
        >
          {statusMap[status]}
        </Typography>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <RequestInfo
          requestId={id}
          onClose={() => setOpen(false)}
          updateStatus={updateStatus}
          updateInfo={updateInfo}
        />
      </Dialog>
    </>
  );
};

export default Request;
