import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectActions } from "../components/ProjectActions";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { useProjectPage } from "../hooks/useProjectPage";
import { getProjectsPath, parseProjectId } from "../utils/projectRoutes";

export function ProjectTasksPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const numericProjectId = parseProjectId(projectId);
  const {
    project,
    tasks,
    projectLoading,
    tasksLoading,
    projectError,
    tasksError,
    refetchProject,
    refetchTasks,
  } = useProjectPage(numericProjectId);

  if (numericProjectId === null) {
    return (
      <Box maxWidth={640} mx="auto" mt={6}>
        <Alert severity="error">The project ID is invalid.</Alert>
      </Box>
    );
  }

  return (
    <Box maxWidth={840} mx="auto" mt={6} px={2}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(getProjectsPath())}
        >
          Back
        </Button>

        <Typography variant="h4">
          {projectLoading ? "Loading project…" : (project?.name ?? "Project Tasks")}
        </Typography>
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Project ID: {numericProjectId}
        </Typography>

        {projectError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Could not load project details: {projectError}
          </Alert>
        )}

        {project && (
          <Stack>
            <ProjectActions
              project={project}
              onUpdated={refetchProject}
              onDeleted={() => navigate(getProjectsPath())}
            />
          </Stack>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TaskForm projectId={numericProjectId} onSuccess={refetchTasks} />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <TaskList
          tasks={tasks}
          loading={tasksLoading}
          error={tasksError}
          onChanged={refetchTasks}
        />
      </Paper>
    </Box>
  );
}
