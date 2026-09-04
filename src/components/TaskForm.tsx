import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRef, useState, type FormEvent } from "react";
import { createTask } from "../services/taskService";
import type { TaskPriority } from "../types";

interface TaskFormProps {
  projectId: number;
  onSuccess?: () => void;
}

export function TaskForm({ projectId, onSuccess }: TaskFormProps) {
  const dueDateInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MED");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = title.trim().length >= 3 && title.trim().length <= 120;

  function reset() {
    setTitle("");
    setDescription("");
    setPriority("MED");
    setDueDate("");
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await createTask(projectId, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || null,
      });
      reset();
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6">New Task</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        helperText="Between 3 and 120 characters"
        inputProps={{ minLength: 3, maxLength: 120 }}
        required
        fullWidth
      />

      <TextField
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        multiline
        rows={2}
        fullWidth
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as TaskPriority)}
          fullWidth
        >
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MED">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </TextField>

        <TextField
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          inputRef={dueDateInputRef}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    edge="end"
                    aria-label="Open calendar"
                    onClick={() => dueDateInputRef.current?.showPicker()}
                  >
                    <CalendarMonthIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          fullWidth
        />
      </Stack>

      <Button type="submit" variant="contained" disabled={!valid || submitting}>
        {submitting ? "Creating…" : "Create Task"}
      </Button>
    </Stack>
  );
}
