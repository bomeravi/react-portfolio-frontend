import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, fetchProfile, logout as apiLogout, clearTokens } from "../lib/api";
import { useToast } from "./ToastContext";
import { useQueryClient } from "@tanstack/react-query";

export type User = {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  last_login?: string;
  [key: string]: unknown;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToast } = useToast();

  const refreshProfile = async (): Promise<User | null> => {
    try {
      const res = await fetchProfile();
      const payload = (res && (res.data ?? res)) as any;
      setUser(payload ?? null);
      return payload ?? null;
    } catch (err) {
      clearTokens();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshProfile();
    })();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await loginApi(username, password);
      const profile = (await fetchProfile()) as any;
      const payload = (profile && (profile.data ?? profile)) as any;
      setUser(payload ?? null);
      addToast('Login successful!', 'success');
      return payload ?? null;
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      addToast('Logout successful!', 'success');
    } catch (err) {
      // ignore
    } finally {
      clearTokens();
      setUser(null);
      queryClient.clear();
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};