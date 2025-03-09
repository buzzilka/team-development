import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";
import { loginUser } from "../../api/authEndpoints";

const schema = yup.object({
  login: yup.string().min(6, "Минимум 6 символов").required("Введите логин"),
  password: yup
    .string()
    .min(6, "Минимум 6 символов")
    .required("Введите пароль"),
});

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { login: string; password: string }) => {
    try {
      const response = await loginUser(data.login, data.password);
      localStorage.setItem("token", response.token);
      window.location.href = "/profile";
    } catch (error) {
      console.log(error);
      alert("Ошибка входа");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Typography variant="h5" textAlign="center" mb={2}>
        Вход
      </Typography>

      <TextField
        label="Логин"
        fullWidth
        margin="normal"
        {...register("login")}
        error={!!errors.login}
        helperText={errors.login?.message}
      />

      <TextField
        label="Пароль"
        type="password"
        fullWidth
        margin="normal"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button
        disableRipple
        variant="outlined"
        type="submit"
        color="primary"
        fullWidth
        sx={{
          mt: 3,
          border: "none",
          fontWeight: "bold",
          color: "#0060e6",
          bgcolor: "#e8f2fc",
          "&:hover": {
            bgcolor: " #bad9f7",
          },
        }}
      >
        Войти
      </Button>
    </Box>
  );
};

export default LoginForm;
