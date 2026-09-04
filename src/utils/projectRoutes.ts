export function getProjectsPath(): string {
  return "/dashboard";
}

export function getProjectPath(projectId: number): string {
  return `/projects/${projectId}`;
}

export function getProjectTasksPath(projectId: number): string {
  return `/projects/${projectId}/tasks`;
}

export function parseProjectId(projectId: string | undefined): number | null {
  const parsedProjectId = Number(projectId);

  return Number.isInteger(parsedProjectId) && parsedProjectId > 0
    ? parsedProjectId
    : null;
}
