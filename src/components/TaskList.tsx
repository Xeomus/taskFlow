import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Task } from "../types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onChanged: () => void;
}

export function TaskList({
  tasks,
  loading,
  error,
  onChanged,
}: TaskListProps) {
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

  if (tasks.length === 0) {
    return <Typography color="text.secondary">No tasks found.</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Tasks ({tasks.length})</Typography>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onChanged={onChanged} />
      ))}
    </Stack>
  );
}
