import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Project } from "../types";
import { ProjectActions } from "./ProjectActions";

interface ProjectItemProps {
  project: Project;
  onChanged: () => void;
}

export function ProjectItem({ project, onChanged }: ProjectItemProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "flex-start" }}
        spacing={2}
      >
        <Stack spacing={0.5}>
          <Typography variant="subtitle1">{project.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {project.description || "No description"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID {project.id} · Owner ID {project.ownerId} · Created{" "}
            {project.createdAt}
          </Typography>
        </Stack>

        <ProjectActions
          project={project}
          onUpdated={onChanged}
          onDeleted={onChanged}
        />
      </Stack>
    </Paper>
  );
}
