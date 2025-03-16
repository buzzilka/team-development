import { CircularProgress, styled } from "@mui/material";

export const CenteredProgress = styled(CircularProgress)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 9999,
});
