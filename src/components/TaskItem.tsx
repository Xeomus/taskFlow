import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import { useTaskActions } from "../hooks/useTaskActions";
import type { Task, TaskPriority, TaskStatus } from "../types";

interface TaskItemProps {
  task: Task;
  onChanged: () => void;
}

const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export function TaskItem({ task, onChanged }: TaskItemProps) {
  const actions = useTaskActions({
    task,
    onUpdated: onChanged,
    onDeleted: onChanged,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const dueDateInputRef = useRef<HTMLInputElement>(null);

  function confirmDelete() {
    void actions.handleDelete();
  }

  return (
    <>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          {actions.error && !actions.editing && !deleteDialogOpen && (
            <Alert severity="error">{actions.error}</Alert>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack spacing={0.75}>
              <Typography variant="subtitle1">{task.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {task.description || "No description"}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip size="small" label={`Priority: ${task.priority}`} />
                <Chip size="small" label={`Status: ${task.status}`} />
                {task.dueDate && (
                  <Chip size="small" label={`Due: ${task.dueDate}`} />
                )}
              </Stack>
            </Stack>

            <Stack spacing={1} minWidth={{ sm: 180 }}>
              <TextField
                select
                size="small"
                label="Status"
                value={task.status}
                onChange={(event) =>
                  void actions.handleStatusChange(
                    event.target.value as TaskStatus,
                  )
                }
                disabled={actions.busy}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={actions.startEditing}
                  disabled={actions.busy}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={actions.busy}
                >
                  {actions.deleting ? "Deleting…" : "Delete"}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Dialog
        open={actions.editing}
        onClose={actions.busy ? undefined : actions.cancelEditing}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={actions.handleUpdate}>
          <DialogTitle>Edit Task #{task.id}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {actions.error && <Alert severity="error">{actions.error}</Alert>}
              <TextField
                label="Title"
                value={actions.title}
                onChange={(event) => actions.setTitle(event.target.value)}
                helperText="Between 3 and 120 characters"
                inputProps={{ minLength: 3, maxLength: 120 }}
                required
                autoFocus
                fullWidth
              />
              <TextField
                label="Description"
                value={actions.description}
                onChange={(event) => actions.setDescription(event.target.value)}
                multiline
                rows={3}
                fullWidth
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  select
                  label="Priority"
                  value={actions.priority}
                  onChange={(event) =>
                    actions.setPriority(event.target.value as TaskPriority)
                  }
                  fullWidth
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MED">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </TextField>
                <TextField
                  label="Due date"
                  type="date"
                  value={actions.dueDate}
                  onChange={(event) => actions.setDueDate(event.target.value)}
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
                            onClick={() =>
                              dueDateInputRef.current?.showPicker()
                            }
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
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              startIcon={<CloseIcon />}
              onClick={actions.cancelEditing}
              disabled={actions.busy}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!actions.valid || actions.busy}
            >
              {actions.saving ? "Saving…" : "Save changes"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={
          actions.deleting ? undefined : () => setDeleteDialogOpen(false)
        }
      >
        <DialogTitle>Delete task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete “{task.title}”? This action cannot
            be undone.
          </DialogContentText>
          {actions.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actions.error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={actions.deleting}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
            disabled={actions.deleting}
          >
            {actions.deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
