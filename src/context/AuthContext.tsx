import { createContext, useCallback, useLayoutEffect, useState, type ReactNode } from "react";
import * as authService from "../services/authService";
import { getApiErrorMessage, installUnauthorizedInterceptor } from "../services/httpClient";
import { USERNAME_KEY, ROLE_KEY } from "../types";

type User = Pick<authService.AuthUser, "username" | "role">;

interface LoginResult {
  success: boolean;
  error?: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(authService.getToken()),
  );
  const [user, setUser] = useState<User | null>(() =>
    authService.getToken()
      ? {
          username: localStorage.getItem(USERNAME_KEY) || "User",
          role: localStorage.getItem(ROLE_KEY) || "Unknown",
        }
      : null,
  );

  const handleLogout = useCallback(() => {
    authService.clearToken();
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useLayoutEffect(
    () => installUnauthorizedInterceptor(handleLogout),
    [handleLogout],
  );

  async function handleLogin(
    username: string,
    password: string,
  ): Promise<LoginResult> {
    try {
      const token = await authService.login(username, password);
      authService.saveToken(token);
      const user = await authService.getCurrentUser();
      localStorage.setItem(USERNAME_KEY, user.username);
      localStorage.setItem(ROLE_KEY, user.role);
      setUser({ username: user.username, role: user.role });
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      handleLogout();
      return { success: false, error: getApiErrorMessage(err) };
    }
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
