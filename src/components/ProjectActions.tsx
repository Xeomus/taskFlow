import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useProjectActions } from "../hooks/useProjectActions";
import type { Project } from "../types";

interface ProjectActionsProps {
  project: Project;
  onUpdated: () => void;
  onDeleted: () => void;
}

export function ProjectActions({
  project,
  onUpdated,
  onDeleted,
}: ProjectActionsProps) {
  const actions = useProjectActions({ project, onUpdated, onDeleted });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function confirmDelete() {
    void actions.handleDelete();
  }

  return (
    <>
      <Stack spacing={1} alignItems={{ xs: "stretch", sm: "flex-end" }}>
        {actions.error && !actions.editing && !deleteDialogOpen && (
          <Alert severity="error">{actions.error}</Alert>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={actions.startEditing}
            disabled={actions.busy}
          >
            Edit Project
          </Button>

          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            disabled={actions.busy}
          >
            {actions.deleting ? "Deleting…" : "Delete Project"}
          </Button>
        </Stack>
      </Stack>

      <Dialog
        open={actions.editing}
        onClose={actions.busy ? undefined : actions.cancelEditing}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={actions.handleUpdate}>
          <DialogTitle>Edit Project #{project.id}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {actions.error && <Alert severity="error">{actions.error}</Alert>}
              <TextField
                label="Name"
                value={actions.name}
                onChange={(event) => actions.setName(event.target.value)}
                helperText="Between 3 and 80 characters"
                inputProps={{ minLength: 3, maxLength: 80 }}
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
        onClose={actions.deleting ? undefined : () => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you delete “{project.name}”, all its tasks will also be
            deleted. This action cannot be undone.
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
