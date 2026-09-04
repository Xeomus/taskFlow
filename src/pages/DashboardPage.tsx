import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { ProjectForm } from "../components/ProjectForm";
import { ProjectList } from "../components/ProjectList";
import { useAuth } from "../hooks/useAuth";
import { useProjects } from "../hooks/useProjects";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { projects, loading, error, refetch } = useProjects();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Box maxWidth={720} mx="auto" mt={6} px={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome, {user?.username || "User"}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: {user?.role || "Unknown"}
          </Typography>
        </Box>

        <Button startIcon={<LogoutIcon />} onClick={handleLogout}>
          Logout
        </Button>
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <ProjectForm onSuccess={refetch} />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <ProjectList
          projects={projects}
          loading={loading}
          error={error}
          onChanged={refetch}
        />
      </Paper>
    </Box>
  );
}
