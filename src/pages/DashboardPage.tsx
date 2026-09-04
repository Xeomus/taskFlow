import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Box maxWidth={720} mx="auto" mt={6} px={2}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
            <Typography color="text.secondary">
              Welcome, {localStorage.getItem("username") || "User"}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {localStorage.getItem("role") || "Unknown"}
            </Typography>
          </Box>
          <Button startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
