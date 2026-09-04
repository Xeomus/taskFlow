import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box maxWidth={720} mx="auto" mt={8} px={2}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom>
            TaskFlow
          </Typography>
          <Typography color="text.secondary">
            A focused workspace for projects and tasks.
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
