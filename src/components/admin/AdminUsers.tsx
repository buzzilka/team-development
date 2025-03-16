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
  updateUserRole,
} from "../../api/adminEndpoints";
import { UserInterface } from "../../interfaces/UserInterface";
import { CenteredProgress } from "../../styles/CentredProgress";
import { rolesMap } from "../../styles/maps";

const UserCard = ({
  id,
  name,
  roles,
  group,
  isConfirmed,
  updateUserConfirmation,
  updateRole,
}: UserInterface & {
  updateUserConfirmation: (userId: string, confirmed: boolean) => void;
  updateRole: (userId: string, newRoles: string[]) => void;
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(roles);
  const handleRolesChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedRoles(event.target.value as string[]);
  };

  const handleSaveRolesClick = async (id: string, newRoles: string[]) => {
    try {
      await updateUserRole(id, newRoles);
      updateRole(id, newRoles);
      console.log("Роли сохранены");
    } catch (err) {
      console.error("Ошибка при подтверждении:", err);
    }
  };

  const handleConfirmClick = async (confirm: boolean) => {
    try {
      await confirmAccount({ userId: id, isConfirmed: confirm });
      updateUserConfirmation(id, confirm);
      console.log("Статус профиля изменён");
    } catch (err) {
      console.error("Ошибка при подтверждении:", err);
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
        {roles.includes("Student") && <Typography>Группа: {group}</Typography>}
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

      <Box display="flex" flexDirection="column" gap={2}>
        <FormControl sx={{ maxWidth: "100%" }}>
          <Select
            multiple
            value={selectedRoles}
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
            onClick={() => handleSaveRolesClick(id, selectedRoles)}
            sx={{
              color: "#0060e6",
              fontWeight: "bold",
              borderColor: "#0060e6",
            }}
          >
            Сохранить роли
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlyConfirmed, setOnlyConfirmed] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | "">("");
  const [groupSearch, setGroupSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        onlyConfirmed,
        onlyTheseRoles: selectedRole ? selectedRole : [],
        group: groupSearch,
        page,
        size: pageSize,
      };
      const response = await allUsers(params);
      setUsers(response.value.users);
      setTotalPages(response.value.pagination.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }, [onlyConfirmed, selectedRole, groupSearch, page, pageSize]);

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

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2} mb={2} mt={1}>
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
        <Typography color="error">Ошибка: {error}</Typography>
      ) : users.length > 0 ? (
        <>
          <Stack spacing={2}>
            {users.map((user) => (
              <UserCard
                key={user.id}
                {...user}
                updateUserConfirmation={updateUserConfirmation}
                updateRole={updateUserRoles}
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
