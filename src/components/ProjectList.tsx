import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Project } from "../types";
import { ProjectItem } from "./ProjectItem";

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onChanged: () => void;
}

export function ProjectList({
  projects,
  loading,
  error,
  onChanged,
}: ProjectListProps) {
  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (projects.length === 0) {
    return <Typography color="text.secondary">No projects found.</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Projects ({projects.length})</Typography>

      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} onChanged={onChanged} />
      ))}
    </Stack>
  );
}
