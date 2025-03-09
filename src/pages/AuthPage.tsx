import { useState } from "react";
import { Container, Tab, Tabs, Box } from "@mui/material";
import LoginForm from "../components/auth/LginForm";
import RegisterForm from "../components/auth/RegisterForm";

const AuthPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 5,
          boxShadow: "none",
          p: 3,
          borderRadius: 2,
          bgcolor: "white",
        }}
      >
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
          <Tab disableRipple label="Вход" />
          <Tab disableRipple label="Регистрация" />
        </Tabs>
        {tab === 0 ? <LoginForm /> : <RegisterForm />}
      </Box>
    </Container>
  );
};

export default AuthPage;
