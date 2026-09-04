import type { NewProject, Project, UpdateProject } from "../types";
import { getProjectPath } from "../utils/projectRoutes";

import { httpClient } from "./httpClient";

export async function getProjects(): Promise<Project[]> {
  const { data } = await httpClient.get<Project[]>("/projects");
  return data;
}

export async function getProject(id: number): Promise<Project> {
  const { data } = await httpClient.get<Project>(getProjectPath(id));
  return data;
}

export async function createProject(body: NewProject): Promise<Project> {
  const { data } = await httpClient.post<Project>("/projects", body);
  return data;
}

export async function updateProject(
  id: number,
  body: UpdateProject,
): Promise<Project> {
  const { data } = await httpClient.put<Project>(`/projects/${id}`, body);
  return data;
}

export async function deleteProject(id: number): Promise<void> {
  await httpClient.delete(`/projects/${id}`);
}
