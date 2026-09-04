import { useState, type FormEvent } from "react";
import { deleteProject, updateProject } from "../services/projectService";
import type { Project } from "../types";

interface UseProjectActionsOptions {
  project: Project;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

export function useProjectActions({
  project,
  onUpdated,
  onDeleted,
}: UseProjectActionsOptions) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = name.trim().length >= 3 && name.trim().length <= 80;
  const busy = saving || deleting;

  function startEditing() {
    setName(project.name);
    setDescription(project.description ?? "");
    setError(null);
    setEditing(true);
  }

  function cancelEditing() {
    setName(project.name);
    setDescription(project.description ?? "");
    setError(null);
    setEditing(false);
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || busy) return;

    setSaving(true);
    setError(null);

    try {
      await updateProject(project.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setEditing(false);
      onUpdated?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error updating project");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (busy) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteProject(project.id);
      onDeleted?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error deleting project");
    } finally {
      setDeleting(false);
    }
  }

  return {
    editing,
    name,
    setName,
    description,
    setDescription,
    saving,
    deleting,
    error,
    valid,
    busy,
    startEditing,
    cancelEditing,
    handleUpdate,
    handleDelete,
  };
}
