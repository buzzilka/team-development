import { useState } from "react";
import { Card, Tab, Tabs } from "@mui/material";
import AdminUsers from "./AdminUsers";
import RequestsCard from "../request/RequestsCard";
import RequestsDownload from "./RequestsDownload";

const AuthPage = () => {
  const storedTab = localStorage.getItem("authPageTab");
  const [tab, setTab] = useState(storedTab ? Number(storedTab) : 0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    localStorage.setItem("authPageTab", String(newValue)); 
  };

  return (
    <Card elevation={0} sx={{ maxWidth: 800, mx: "auto", p: 3, mt: 1 }}>
      <Tabs value={tab} onChange={handleChange} centered>
        <Tab disableRipple label="Пользователи" />
        <Tab disableRipple label="Заявки" />
        <Tab disableRipple label="Выгрузка одобренных заявок" />
      </Tabs>

      {tab === 0 && <AdminUsers />}
      {tab === 1 && <RequestsCard role="Dean" />}
      {tab === 2 && <RequestsDownload/>}
    </Card>
  );
};

export default AuthPage;
