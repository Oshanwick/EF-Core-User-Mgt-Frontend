// src/services/api.ts
const BASE = import.meta.env.VITE_API_URL as string;

export async function api<T>(
  path: string,
  options: RequestInit = {},
  authToken?: string
): Promise<T> {
  // make headers a string dictionary, not HeadersInit
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}

export type TokenResponse = { accessToken: string; expiresAtUtc: string };
export type RegisterDto = { email: string; password: string; firstName: string; lastName: string };
export type LoginDto = { email: string; password: string };
export type UserRow = { id: string; email: string; firstName: string; lastName: string; createdAt: string };
