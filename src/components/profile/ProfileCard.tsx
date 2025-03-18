import { Card, Typography, Avatar, Button, Grid } from "@mui/material";
import { logout } from "../../api/profileEndpoints";
import { UserInterface } from "../../interfaces/UserInterface";
import { rolesMap } from "../../styles/maps";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { errorPopup } from "../../styles/notifications";

function ProfileCard({ name, roles, isConfirmed, group }: UserInterface) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate("/auth");
    } catch (error) {
      let errorMessage = "Произошла неизвестная ошибка";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || "Непредвиденная ошибка.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorPopup("Ошибка выхода", errorMessage);
    }
  };

  return (
    <Card elevation={0} sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm="auto">
          <Avatar sx={{ width: 64, height: 64 }} />
        </Grid>

        <Grid item xs={12} sm>
          <Typography variant="h6" fontWeight="bold">
            {name}
          </Typography>

          {roles.map((role, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                bgcolor: "grey.200",
                display: "inline-block",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                mt: 0.5,
                mr: 1,
              }}
            >
              {rolesMap[role]}
            </Typography>
          ))}

          {roles.includes("Student") && (
            <Typography
              variant="body2"
              sx={{
                bgcolor: "grey.200",
                display: "inline-block",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                mt: 0.5,
                mr: 1,
              }}
            >
              {group}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              bgcolor: isConfirmed ? "#e8fcf4" : "#fce8e8",
              color: isConfirmed ? "#0a7649" : "#c82d22",
              display: "inline-block",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              mt: 0.5,
            }}
          >
            {isConfirmed ? "Подтверждён" : "Не подверждён"}
          </Typography>
        </Grid>
      </Grid>

      <Button
        variant="outlined"
        disableRipple
        fullWidth
        sx={{
          mt: 3,
          color: "#c82d22",
          bgcolor: "#fce8e8",
          border: "none",
          fontWeight: "bold",
          "&:hover": {
            bgcolor: " #f7baba",
          },
        }}
        onClick={handleLogout}
      >
        Выйти из аккаунта
      </Button>
    </Card>
  );
}

export default ProfileCard;
