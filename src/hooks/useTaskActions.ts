import { useState, type FormEvent } from "react";
import {
  deleteTask,
  updateTask,
  updateTaskStatus,
} from "../services/taskService";
import type { Task, TaskPriority, TaskStatus } from "../types";

interface UseTaskActionsOptions {
  task: Task;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

export function useTaskActions({
  task,
  onUpdated,
  onDeleted,
}: UseTaskActionsOptions) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  const [saving, setSaving] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = title.trim().length >= 3 && title.trim().length <= 120;
  const busy = saving || changingStatus || deleting;

  function startEditing() {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setPriority(task.priority);
    setDueDate(task.dueDate ?? "");
    setError(null);
    setEditing(true);
  }

  function cancelEditing() {
    setError(null);
    setEditing(false);
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || busy) return;

    setSaving(true);
    setError(null);
    try {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || null,
      });
      setEditing(false);
      onUpdated?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error updating task");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(status: TaskStatus) {
    if (busy || status === task.status) return;

    setChangingStatus(true);
    setError(null);
    try {
      await updateTaskStatus(task.id, status);
      onUpdated?.();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error changing task status",
      );
    } finally {
      setChangingStatus(false);
    }
  }

  async function handleDelete() {
    if (busy) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteTask(task.id);
      onDeleted?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error deleting task");
    } finally {
      setDeleting(false);
    }
  }

  return {
    editing,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    saving,
    changingStatus,
    deleting,
    error,
    valid,
    busy,
    startEditing,
    cancelEditing,
    handleUpdate,
    handleStatusChange,
    handleDelete,
  };
}
