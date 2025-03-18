import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { registerUser } from "../../api/authEndpoints";
import { AxiosError } from "axios";
import { errorPopup } from "../../styles/notifications";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  name: yup.string().required("Введите ФИО"),
  login: yup.string().min(6, "Минимум 6 символов").required("Введите логин"),
  password: yup
    .string()
    .min(6, "Минимум 6 символов")
    .required("Введите пароль"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Пароли не совпадают")
    .required("Повторите пароль"),
  roles: yup.array().of(yup.string().required()).required("Роль обязательна"),
  group: yup.string().when("roles", {
    is: (roles: string[]) => roles.includes("Student"),
    then: (schema) => schema.required("Введите номер группы"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const RegisterForm = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { roles: [] as string[] },
  });

  const roles = watch("roles");

  const navigate = useNavigate();

  const onSubmit = async (data: {
    name: string;
    login: string;
    password: string;
    roles: string[];
    group?: string;
  }) => {
    try {
      const response = await registerUser(
        data.name,
        data.login,
        data.password,
        data.roles,
        data.group || ""
      );
      localStorage.setItem("token", response.token);
      navigate("/profile");
    } catch (error) {
      let errorMessage = "Произошла неизвестная ошибка";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || "Непредвиденная ошибка.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorPopup("Ошибка регистрации", errorMessage);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Typography variant="h5" textAlign="center" mb={2}>
        Регистрация
      </Typography>

      <TextField
        label="ФИО"
        fullWidth
        margin="normal"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        label="Логин"
        fullWidth
        margin="normal"
        {...register("login")}
        error={!!errors.login}
        helperText={errors.login?.message}
      />

      <FormControl fullWidth margin="normal" error={!!errors.roles}>
        <InputLabel>Роль</InputLabel>
        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              multiple
              label="Роль"
              value={roles}
              onChange={(e) => setValue("roles", e.target.value as string[])}
            >
              <MenuItem disableRipple value="Student">
                Студент
              </MenuItem>
              <MenuItem disableRipple value="Teacher">
                Преподаватель
              </MenuItem>
            </Select>
          )}
        />
      </FormControl>

      {roles!.includes("Student") && (
        <TextField
          label="Номер группы"
          fullWidth
          margin="normal"
          {...register("group")}
          error={!!errors.group}
          helperText={errors.group?.message}
        />
      )}

      <TextField
        label="Пароль"
        type="password"
        fullWidth
        margin="normal"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        label="Повторите пароль"
        type="password"
        fullWidth
        margin="normal"
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Button
        disableRipple
        type="submit"
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
      >
        Зарегистрироваться
      </Button>
    </Box>
  );
};

export default RegisterForm;
