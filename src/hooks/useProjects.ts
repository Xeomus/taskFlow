import { useCallback } from "react";
import { getProjects } from "../services/projectService";
import type { Project } from "../types";
import { useApiResource } from "./useApiResource";

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProjects(): UseProjectsResult {
  const loadProjects = useCallback(() => getProjects(), []);
  const { data, loading, error, refetch } = useApiResource<Project[]>({
    load: loadProjects,
    initialData: [],
  });

  return { projects: data, loading, error, refetch };
}
