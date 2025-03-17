import { useState } from "react";
import { Card, Tab, Tabs, useMediaQuery, Theme } from "@mui/material";
import AdminUsers from "./AdminUsers";
import RequestsCard from "../request/RequestsCard";
import RequestsDownload from "./RequestsDownload";

interface AdminPannelProps {
  roles: string[];
}

const AdminPannel = ({ roles }: AdminPannelProps) => {
  const storedTab = localStorage.getItem("authPageTab");
  const [tab, setTab] = useState(storedTab ? Number(storedTab) : 0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    localStorage.setItem("authPageTab", String(newValue));
  };

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const hasRole = (role: string) => roles.includes(role);

  const tabs = [];

  if (hasRole("Dean")) {
    tabs.push({
      label: "Пользователи",
      component: <AdminUsers role="Dean" />,
    });
    tabs.push({ label: "Заявки", component: <RequestsCard role="Dean" /> });
  }

  if (hasRole("Teacher") && !hasRole("Dean")) {
    tabs.push({
      label: "Пользователи",
      component: <AdminUsers role="Teacher" />,
    });
  }

  if (hasRole("Student")) {
    tabs.push({
      label: "Мои заявки",
      component: <RequestsCard role="Student" />,
    });
  }

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
