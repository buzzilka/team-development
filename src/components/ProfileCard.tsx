import { Card, Typography, Avatar, Button, Grid } from "@mui/material";

function ProfileCard() {
  return (
    <Card elevation={0} sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm="auto">
          <Avatar sx={{ width: 64, height: 64 }} />
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
      >
        Выйти из аккаунта
      </Button>
    </Card>
  );
}

export default ProfileCard;
