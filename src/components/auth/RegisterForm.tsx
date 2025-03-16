import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { registerUser } from "../../api/authEndpoints";
import axios from "axios";

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
  role: yup.string().required("Выберите роль"),
  group: yup.string().when("role", {
    is: "Student",
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
    defaultValues: { role: "", group: "" },
  });

  const role = watch("role");

  useEffect(() => {
    if (role === "Teacher") {
      setValue("group", "-");
    }
  }, [role, setValue]);

  const onSubmit = async (data: {
    name: string;
    login: string;
    password: string;
    role: string;
    group?: string;
  }) => {
    console.log("Данные формы:", data);
    try {
      const response = await registerUser(
        data.name,
        data.login,
        data.password,
        data.role,
        data.group || ""
      );
      localStorage.setItem("token", response.token);
      window.location.href = "/profile";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      } else {
        console.log("Не ошибка сервера");
      }
      alert("Ошибка регистрации");
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

      <FormControl fullWidth margin="normal" error={!!errors.role}>
        <InputLabel>Роль</InputLabel>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Роль">
              <MenuItem disableRipple value="Student">Студент</MenuItem>
              <MenuItem disableRipple value="Teacher">Преподаватель</MenuItem>
            </Select>
          )}
        />
      </FormControl>

      {role === "Student" && (
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
