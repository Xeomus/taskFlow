export function getTasksPath(): string {
  return "/tasks";
}

export function getTaskPath(taskId: number): string {
  return `/tasks/${taskId}`;
}

export function getTaskStatusPath(taskId: number): string {
  return `${getTaskPath(taskId)}/status`;
}

export function getProjectTasksApiPath(projectId: number): string {
  return `/projects/${projectId}/tasks`;
}
