import { 
  Card, 
  Typography, 
  Avatar, 
  Button, 
  Grid 
} from "@mui/material";

function ProfileCard() {
  return (
    <Card sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm="auto">
          <Avatar sx={{ width: 64, height: 64, bgcolor: "gray" }} />
        </Grid>

        <Grid item xs={12} sm>
          <Typography variant="h6" fontWeight="bold">
            Карпук Владислав Александрович
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
            Студент
          </Typography>
        </Grid>
      </Grid>

      <Button variant="contained" color="error" fullWidth sx={{ mt: 3 }}>
        Выйти из аккаунта
      </Button>
    </Card>
  );
}

export default ProfileCard;
