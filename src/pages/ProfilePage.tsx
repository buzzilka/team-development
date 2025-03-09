import ProfileCard from "../components/profile/ProfileCard";
import RequestsCard from "../components/request/RequestsCard";
import { userInfo } from "../api/profileEndpoints";
import { requestsInfo } from "../api/studentEndpoints";
import { useState, useEffect } from "react";
import { CircularProgress, styled } from "@mui/material";

const CenteredProgress = styled(CircularProgress)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 9999,
});

interface User {
  id: string;
  isConfirmed: boolean;
  name: string;
  roles: string[];
  group?: string;
}

interface RequestData {
  id: string;
  dateFrom: Date;
  dateTo: Date;
  status: string;
  confirmationType: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await userInfo();
        const requestsData = await requestsInfo();
        setUser(userData);
        setRequests(requestsData.listLightRequests);
        localStorage.setItem("id", userData.id);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) return <CenteredProgress/>;
  if (!user) {
    localStorage.clear();
    window.location.href = "/auth";
    return;
  };

  return (
    <>
      <ProfileCard name={user.name} role={user.roles} group={user.group} isConfirmed={user.isConfirmed} />

      {user.isConfirmed && user.roles.includes("Student") && <RequestsCard requests={requests}/>}
    </>
  );
};

export default ProfilePage;
