import { type ReactNode, useCallback, useEffect, useState } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";
import userApi from "@/services/userService";
import type { Role, User } from "@/models/User";
import authApi from "@/services/authService";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isSignedIn = !!token;

  // logout
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout API failed:", err);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");

    setToken(null);
    setUser(null);
  }, []);

  // refresh user
  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await userApi.getProfile();
      setUser(res);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // login
  const login = useCallback(
    async (token: string, role: Role) => {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userRole", role);

      setToken(token);
      await refreshUser();
    },
    [refreshUser]
  );

  // useEffect
  useEffect(() => {
    if (token && !user) refreshUser();
  }, [token, user, refreshUser]);

  const value: AuthContextType = {
    user,
    isSignedIn,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
