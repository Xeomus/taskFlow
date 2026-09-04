import { httpClient } from "./httpClient";
import type {
  Task,
  TaskFilters,
  TaskRequest,
  TaskStatus,
} from "../types";
import {
  getProjectTasksApiPath,
  getTaskPath,
  getTasksPath,
  getTaskStatusPath,
} from "../utils/taskRoutes";

export async function getTasks(filters?: TaskFilters): Promise<Task[]> {
  const { data } = await httpClient.get<Task[]>(getTasksPath(), {
    params: filters,
  });
  return data;
}

export async function getProjectTasks(projectId: number): Promise<Task[]> {
  const { data } = await httpClient.get<Task[]>(
    getProjectTasksApiPath(projectId),
  );
  return data;
}

export async function getTask(taskId: number): Promise<Task> {
  const { data } = await httpClient.get<Task>(getTaskPath(taskId));
  return data;
}

export async function createTask(
  projectId: number,
  body: TaskRequest,
): Promise<Task> {
  const { data } = await httpClient.post<Task>(
    getProjectTasksApiPath(projectId),
    body,
  );
  return data;
}

export async function updateTask(
  taskId: number,
  body: TaskRequest,
): Promise<Task> {
  const { data } = await httpClient.put<Task>(getTaskPath(taskId), body);
  return data;
}

export async function updateTaskStatus(
  taskId: number,
  status: TaskStatus,
): Promise<Task> {
  const { data } = await httpClient.patch<Task>(getTaskStatusPath(taskId), {
    status,
  });
  return data;
}

export async function deleteTask(taskId: number): Promise<void> {
  await httpClient.delete(getTaskPath(taskId));
}
