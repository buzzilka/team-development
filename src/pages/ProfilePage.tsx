import ProfileCard from "../components/profile/ProfileCard";
import RequestsCard from "../components/request/RequestsCard";
import { userInfo } from "../api/profileEndpoints";
import { useState, useEffect } from "react";
import AdminPanel from "../components/admin/AdminPanel";
import { UserInterface } from "../interfaces/UserInterface";
import { CenteredProgress } from "../styles/CentredProgress";
import { Card } from "@mui/material";

const ProfilePage = () => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await userInfo();
        setUser(userData);
        localStorage.setItem("id", userData.id);
        localStorage.setItem("roles", userData.roles);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) return <CenteredProgress />;
  if (!user) {
    localStorage.clear();
    window.location.href = "/auth";
    return;
  }

  return (
    <>
      <ProfileCard
        id={user.id}
        name={user.name}
        roles={user.roles}
        group={user.group}
        isConfirmed={user.isConfirmed}
      />

      {user.isConfirmed && user.roles.includes("Student") && (
        <Card elevation={0} sx={{ maxWidth: 800, mx: "auto", p: 3, mt: 1 }}>
          <RequestsCard role="Student" /> 
        </Card>
      )}

      {user.isConfirmed && user.roles.includes("Dean") && <AdminPanel />}
    </>
  );
};

export default ProfilePage;
