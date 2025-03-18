import { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Box,
  Stack,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Button,
  FormControl,
  ListItemText,
  SelectChangeEvent,
  Pagination,
} from "@mui/material";
import {
  allUsers,
  confirmAccount,
  updateUserGroup,
  updateUserRole,
} from "../../api/adminEndpoints";
import { UserInterface } from "../../interfaces/UserInterface";
import { CenteredProgress } from "../../styles/CentredProgress";
import { rolesMap } from "../../styles/maps";
import { AxiosError } from "axios";
import {
  errorPopup,
  infoPopup,
  successPopup,
} from "../../styles/notifications";

const UserCard = ({
  id,
  name,
  roles,
  group,
  isConfirmed,
  updateUserConfirmation,
  updateRole,
  updateGroup,
  userRole,
}: UserInterface & {
  updateUserConfirmation: (userId: string, confirmed: boolean) => void;
  updateRole: (userId: string, newRoles: string[]) => void;
  updateGroup: (userId: string, newGroup: string) => void;
  userRole: string;
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(roles);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [newGroup, setNewGroup] = useState(group || "");
  const currentUserId = localStorage.getItem("id");

  const handleRolesChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedRoles(event.target.value as string[]);
  };

  const handleSaveRolesClick = async (id: string, newRoles: string[]) => {
    if (newRoles.length == 0) {
      infoPopup("Нельзя убрать все роли у пользователя");
      return;
    }
    try {
      await updateUserRole(id, newRoles);
      updateRole(id, newRoles);
      successPopup("Роли сохранены.");
    } catch (error) {
      let errorMessage = "Произошла неизвестная ошибка";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || "Непредвиденная ошибка.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorPopup("Ошибка изменения ролей", errorMessage);
    }
  };

  const handleConfirmClick = async (confirm: boolean) => {
    try {
      await confirmAccount({ userId: id, isConfirmed: confirm });
      updateUserConfirmation(id, confirm);
      successPopup("Статус профиля изменён.");
    } catch (error) {
      let errorMessage = "Произошла неизвестная ошибка";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || "Непредвиденная ошибка.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorPopup("Ошибка изменения статуса аккаунта", errorMessage);
    }
  };

  const handleSaveGroupClick = async () => {
    try {
      await updateUserGroup({ userId: id, newGroup: newGroup });
      updateGroup(id, newGroup);
      setIsEditingGroup(false);
      successPopup("Группа обновлена.");
    } catch (error) {
      let errorMessage = "Произошла неизвестная ошибка";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || "Непредвиденная ошибка.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorPopup("Ошибка изменения группы", errorMessage);
    }
  };

  return (
    <Box
      p={2}
      bgcolor={isConfirmed ? "#e8fcf4" : "#fce8e8"}
      borderRadius={1}
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      gap={2}
    >
      <Box>
        <Typography variant="h6">{name}</Typography>
        {roles.includes("Student") && (
          <Box display="flex" alignItems="center" gap={1}>
            <span>Группа:</span>
            {isEditingGroup ? (
              <TextField
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                size="small"
                variant="outlined"
              />
            ) : (
              <span>{group || "Не указано"}</span>
            )}
          </Box>
        )}
        <Typography>
          Роли: {roles.map((role) => rolesMap[role]).join(", ")}
        </Typography>
        <Typography
          color={isConfirmed ? "#0a7649" : "#c82d22"}
          fontWeight="bold"
        >
          {isConfirmed ? "Подтвержден" : "Не подтвержден"}
        </Typography>
      </Box>

      {userRole === "Dean" && (
        <Box display="flex" flexDirection="column" gap={2}>
          <FormControl sx={{ maxWidth: "100%" }}>
            <Select
              multiple
              value={selectedRoles}
              disabled={currentUserId === id}
              onChange={handleRolesChange}
              renderValue={(selected) =>
                (selected as string[]).map((role) => rolesMap[role]).join(", ")
              }
              sx={{
                color: "#0060e6",
                fontWeight: "bold",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0060e6",
                },
              }}
            >
              {Object.entries(rolesMap).map(([value, label]) => (
                <MenuItem disableRipple key={value} value={value}>
                  <Checkbox
                    disableRipple
                    checked={selectedRoles.includes(value)}
                  />
                  <ListItemText primary={label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box display="flex" flexDirection="column" gap={1}>
            {isConfirmed ? (
              <Button
                disableRipple
                variant="outlined"
                size="small"
                disabled={currentUserId === id}
                onClick={() => handleConfirmClick(false)}
                sx={{
                  color: "#0060e6",
                  fontWeight: "bold",
                  borderColor: "#0060e6",
                }}
              >
                Отменить подтверждение аккаунта
              </Button>
            ) : (
              <Button
                disableRipple
                variant="outlined"
                size="small"
                disabled={currentUserId === id}
                onClick={() => handleConfirmClick(true)}
                sx={{
                  color: "#0060e6",
                  fontWeight: "bold",
                  borderColor: "#0060e6",
                }}
              >
                Подтвердить аккаунт
              </Button>
            )}
            <Button
              disableRipple
              variant="outlined"
              size="small"
              disabled={currentUserId === id}
              onClick={() => handleSaveRolesClick(id, selectedRoles)}
              sx={{
                color: "#0060e6",
                fontWeight: "bold",
                borderColor: "#0060e6",
              }}
            >
              Сохранить роли
            </Button>

            {roles.includes("Student") &&
              (isEditingGroup ? (
                <Button
                  disableRipple
                  variant="outlined"
                  size="small"
                  onClick={handleSaveGroupClick}
                  sx={{
                    color: "#0060e6",
                    fontWeight: "bold",
                    borderColor: "#0060e6",
                  }}
                >
                  Сохранить группу
                </Button>
              ) : (
                <Button
                  disableRipple
                  variant="outlined"
                  size="small"
                  onClick={() => setIsEditingGroup(true)}
                  sx={{
                    color: "#0060e6",
                    fontWeight: "bold",
                    borderColor: "#0060e6",
                  }}
                >
                  Изменить группу
                </Button>
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

interface AdminUsersProps {
  role: string;
}

const AdminUsers = ({ role }: AdminUsersProps) => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean | null>(null);
  const [onlyConfirmed, setOnlyConfirmed] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | "">("");
  const [groupSearch, setGroupSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    let response;
    let params;
    try {
      if (role === "Dean") {
        params = {
          onlyConfirmed,
          onlyTheseRoles: selectedRole ? selectedRole : [],
          group: groupSearch,
          page,
          size: pageSize,
        };
        response = await allUsers(params);
        setUsers(response.value.users);
        setTotalPages(response.value.pagination.count);
      } else if (role === "Teacher") {
        params = {
          onlyConfirmed: true,
          onlyTheseRoles: "Student",
          group: groupSearch,
          page,
          size: pageSize,
        };
        response = await allUsers(params);
        setUsers(response.value.users);
        setTotalPages(response.value.pagination.count);
      }
    } catch (error) {
      let errorMessage = "Произошла неизвестная ошибка";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || "Непредвиденная ошибка.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorPopup("Ошибка загрузки пользователей.", errorMessage);
      setError(true)
    } finally {
      setLoading(false);
    }
  }, [onlyConfirmed, selectedRole, groupSearch, page, pageSize, role]);

  useEffect(() => {
    fetchUsers();
  }, [onlyConfirmed, selectedRole, groupSearch, page, pageSize, fetchUsers]);

  const updateUserConfirmation = (userId: string, confirmed: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isConfirmed: confirmed } : user
      )
    );
  };

  const updateUserRoles = (userId: string, newRoles: string[]) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, roles: newRoles } : user
      )
    );
  };

  const updateGroup = (id: string, newGroup: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, group: newGroup } : user
      )
    );
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2} mb={2} mt={1}>
        {role === "Dean" && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={onlyConfirmed}
                  onChange={(e) => setOnlyConfirmed(e.target.checked)}
                />
              }
              label="Только подтвержденные"
            />
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              displayEmpty
            >
              <MenuItem disableRipple value="">
                Все роли
              </MenuItem>
              <MenuItem disableRipple value="Student">
                Студент
              </MenuItem>
              <MenuItem disableRipple value="Teacher">
                Преподаватель
              </MenuItem>
            </Select>
          </>
        )}
        <TextField
          label="Группа"
          variant="outlined"
          value={groupSearch}
          onChange={(e) => setGroupSearch(e.target.value)}
        />
      </Box>

      {loading ? (
        <CenteredProgress />
      ) : error ? (
        <Typography
          color="error"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%", 
          }}
          fontSize={16}
        >
          Что-то пошло не так 😭
        </Typography>
      ) : users.length > 0 ? (
        <>
          <Stack spacing={2}>
            {users.map((user) => (
              <UserCard
                key={user.id}
                {...user}
                updateUserConfirmation={updateUserConfirmation}
                updateRole={updateUserRoles}
                updateGroup={updateGroup}
                userRole={role}
              />
            ))}
          </Stack>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              size="small"
            >
              <MenuItem disableRipple value={5}>
                5
              </MenuItem>
              <MenuItem disableRipple value={10}>
                10
              </MenuItem>
              <MenuItem disableRipple value={20}>
                20
              </MenuItem>
            </Select>

            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={100}
        >
          <Typography variant="body2" fontSize="20px">
            Пользователей пока нет 😎
          </Typography>
        </Box>
      )}
    </>
  );
};

export default AdminUsers;
