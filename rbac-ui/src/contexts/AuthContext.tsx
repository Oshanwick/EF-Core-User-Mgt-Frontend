import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { LoginDto, RegisterDto, TokenResponse } from "../services/api"; // ✅ type-only import
import { getRoles, tokenExpired } from "../utils/jwt";

type AuthState = {
  token: string | null;
  roles: string[];
  isAuthed: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("rbac_token"));

  useEffect(() => {
    if (token && tokenExpired(token)) {
      localStorage.removeItem("rbac_token");
      setToken(null);
    }
  }, [token]);

  const roles = useMemo(() => (token ? getRoles(token) : []), [token]);

  async function login(dto: LoginDto) {
    const data = await api<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    localStorage.setItem("rbac_token", data.accessToken);
    setToken(data.accessToken);
  }

  async function register(dto: RegisterDto) {
    const data = await api<TokenResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    localStorage.setItem("rbac_token", data.accessToken);
    setToken(data.accessToken);
  }

  function logout() {
    localStorage.removeItem("rbac_token");
    setToken(null);
  }

  const value: AuthState = {
    token,
    roles,
    isAuthed: !!token,
    login,
    register,
    logout,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
