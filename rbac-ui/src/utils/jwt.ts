import { jwtDecode } from "jwt-decode";

export type DecodedJwt = {
  exp?: number;
  email?: string;
  [key: string]: any;
};

const ROLE_URN = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const NAMEID_URN = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

export function decodeJwt(token: string): DecodedJwt | null {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function tokenExpired(token: string): boolean {
  const d = decodeJwt(token);
  if (!d?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return d.exp < now;
}

export function getRoles(token: string): string[] {
  const d = decodeJwt(token);
  if (!d) return [];
  const raw = (d["role"] ?? d[ROLE_URN]) as string | string[] | undefined;
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

export function getUserId(token: string): string | undefined {
  const d = decodeJwt(token);
  if (!d) return undefined;
  return (d["uid"] ?? d[NAMEID_URN] ?? d["sub"]) as string | undefined;
}
