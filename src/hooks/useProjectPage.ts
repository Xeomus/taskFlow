import { useCallback } from "react";
import { getProject } from "../services/projectService";
import { getProjectTasks } from "../services/taskService";
import type { Project, Task } from "../types";
import { useApiResource } from "./useApiResource";

export function useProjectPage(projectId: number | null) {
  const loadProject = useCallback(
    () => (projectId === null ? Promise.resolve(null) : getProject(projectId)),
    [projectId],
  );
  const loadTasks = useCallback(
    () =>
      projectId === null ? Promise.resolve([]) : getProjectTasks(projectId),
    [projectId],
  );

  const projectResource = useApiResource<Project | null>({
    load: loadProject,
    initialData: null,
    enabled: projectId !== null,
  });
  const tasksResource = useApiResource<Task[]>({
    load: loadTasks,
    initialData: [],
    enabled: projectId !== null,
  });

  return {
    project: projectResource.data,
    tasks: tasksResource.data,
    projectLoading: projectResource.loading,
    tasksLoading: tasksResource.loading,
    projectError: projectResource.error,
    tasksError: tasksResource.error,
    refetchProject: projectResource.refetch,
    refetchTasks: tasksResource.refetch,
  };
}
