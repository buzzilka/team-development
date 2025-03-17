import { useState } from "react";
import { Card, Tab, Tabs, useMediaQuery, Theme } from "@mui/material";
import AdminUsers from "./AdminUsers";
import RequestsCard from "../request/RequestsCard";
import RequestsDownload from "./RequestsDownload";

interface AdminPannelProps {
  role: string;
}

const AdminPannel = ({ role }: AdminPannelProps) => {
  const storedTab = localStorage.getItem("authPageTab");
  const [tab, setTab] = useState(storedTab ? Number(storedTab) : 0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    localStorage.setItem("authPageTab", String(newValue));
  };

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const tabs = [];
  if (role === "Dean")
    tabs.push({ label: "Заявки", component: <RequestsCard role="Dean" /> });
  tabs.push({ label: "Пользователи", component: <AdminUsers role={role} /> });
  tabs.push({
    label: "Выгрузка одобренных заявок",
    component: <RequestsDownload />,
  });

  return (
    <Card elevation={0} sx={{ maxWidth: 800, mx: "auto", p: 3, mt: 1 }}>
      <Tabs
        value={tab}
        onChange={handleChange}
        variant={isSmallScreen ? "scrollable" : "standard"}
        centered={!isSmallScreen}
      >
        {tabs.map((t, index) => (
          <Tab key={index} disableRipple label={t.label} />
        ))}
      </Tabs>

      {tabs[tab]?.component}
    </Card>
  );
};

export default AdminPannel;
