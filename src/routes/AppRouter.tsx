import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import { ThemeProvider } from "@emotion/react";
import theme from "../styles/theme";
import { CssBaseline } from "@mui/material";
import ProfilePage from "../pages/ProfilePage";

const AppRouter = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </BrowserRouter>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default AppRouter;
