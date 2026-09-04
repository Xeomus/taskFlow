import axios from "axios";
import { getApiBaseUrl } from "../config/apiUrl";
import { TOKEN_KEY } from "../types";

export const httpClient = axios.create({
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function installUnauthorizedInterceptor(onUnauthorized: () => void) {
  const interceptor = httpClient.interceptors.response.use(
    (response) => response,
    (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        onUnauthorized();
      }
      return Promise.reject(err);
    },
  );
  return () => httpClient.interceptors.response.eject(interceptor);
}

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 401) {
      return "Incorrect username or password.";
    }
    const status = err.response?.status ?? "network";
    return `Error HTTP ${status}: ${err.message}`;
  }
  return err instanceof Error ? err.message : "Unknown error";
}
