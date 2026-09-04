import axios from "axios";
import { getApiBaseUrl } from "../config/apiUrl";
import { TOKEN_KEY } from "../types";
import { httpClient } from "./httpClient";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(
  username: string,
  password: string,
): Promise<string> {
  const { data } = await axios.post<{ token: string }>(
    `${getApiBaseUrl()}/auth/login`,
    { username: username.trim(), password },
  );
  return data.token;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await httpClient.get<AuthUser>("/auth/me");
  return data;
}
