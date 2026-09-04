import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { KeyboardEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../types";
import { getProjectTasksPath } from "../utils/projectRoutes";
import { ProjectActions } from "./ProjectActions";

interface ProjectItemProps {
  project: Project;
  onChanged: () => void;
}

export function ProjectItem({ project, onChanged }: ProjectItemProps) {
  const navigate = useNavigate();

  function openTasks() {
    navigate(getProjectTasksPath(project.id));
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      event.target === event.currentTarget &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      openTasks();
    }
  }

  function stopCardNavigation(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <Paper
      variant="outlined"
      role="link"
      tabIndex={0}
      aria-label={`View tasks for ${project.name}`}
      onClick={openTasks}
      onKeyDown={handleCardKeyDown}
      sx={{
        p: 2,
        cursor: "pointer",
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover, &:focus-visible": {
          borderColor: "primary.main",
          boxShadow: 2,
          outline: "none",
        },
      }}
    >
      <Stack spacing={1.5}>
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

          <Box onClick={stopCardNavigation}>
            <ProjectActions
              project={project}
              onUpdated={onChanged}
              onDeleted={onChanged}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
