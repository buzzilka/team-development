import { Card, Typography, Avatar, Button, Grid } from "@mui/material";
import { logout } from "../../api/profileEndpoints";

interface ProfileCardProps {
  name: string;
  role: string[];
  isConfirmed: boolean;
  group?: string;
}

const ROLE_TRANSLATIONS: Record<string, string> = {
  Student: "Студент",
  Teacher: "Преподаватель",
  Dean: "Администратор",
};

function ProfileCard({ name, role, isConfirmed, group }: ProfileCardProps) {
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/auth";
    } catch (error) {
      console.error("Ошибка при выходе из аккаунта:", error);
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
          <Typography
            variant="body2"
            sx={{
              bgcolor: "grey.200",
              display: "inline-block",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              mt: 0.5,
            }}
          >
            {ROLE_TRANSLATIONS[role[0]]}
          </Typography>

          {role.includes("Student") && (
            <Typography
            variant="body2"
            sx={{
              ml: 1,
              bgcolor: "grey.200",
              display: "inline-block",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              mt: 0.5,
            }}
          >
            {group}
          </Typography>
          )}
          
          <Typography
            variant="body2"
            sx={{
              ml: 1,
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
