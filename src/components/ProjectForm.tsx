import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState, type FormEvent } from "react";
import { createProject } from "../services/projectService";

interface ProjectFormProps {
  onSuccess?: () => void;
}

export function ProjectForm({ onSuccess }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = name.trim().length >= 3;

  function reset() {
    setName("");
    setDescription("");
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      reset();
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating project");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6">New Project</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        helperText="*Minimum 3 characters"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={2}
      />
      <Button type="submit" variant="contained" disabled={!valid || submitting}>
        {submitting ? "Creating…" : "Create Project"}
      </Button>
    </Stack>
  );
}
