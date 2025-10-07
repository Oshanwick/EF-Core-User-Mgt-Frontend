import  { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { UserRow } from "../services/api"; // ✅
import { useAuth } from "../contexts/AuthContext";
const ROLES = ["User", "Manager", "Admin"];

export default function AdminUsers() {
  const { token } = useAuth();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [rolesByUser, setRolesByUser] = useState<Record<string, string[]>>({});

  const authed = useMemo(() => !!token, [token]);

  async function load() {
    if (!token) return;
    setLoading(true);
    setErr("");
    try {
      const users = await api<UserRow[]>("/api/users", {}, token);
      setRows(users);

      // load each user's roles
      const map: Record<string, string[]> = {};
      await Promise.all(
        users.map(async (u) => {
          const r = await api<string[]>(`/api/users/${u.id}/roles`, {}, token);
          map[u.id] = r;
        })
      );
      setRolesByUser(map);
    } catch (e: any) {
      setErr(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [authed]);

  async function addRole(userId: string, role: string) {
    if (!token) return;
    await api(`/api/users/${userId}/roles/${role}`, { method: "POST" }, token);
    await load();
  }

  async function removeRole(userId: string, role: string) {
    if (!token) return;
    await api(`/api/users/${userId}/roles/${role}`, { method: "DELETE" }, token);
    await load();
  }

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Admin: Users</h1>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {loading ? <p>Loading…</p> : (
        <table width="100%" cellPadding={6} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Email</th>
              <th align="left">Name</th>
              <th align="left">Created</th>
              <th align="left">Roles</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.id} style={{ borderTop: "1px solid #ddd" }}>
                <td>{u.email}</td>
                <td>{u.firstName} {u.lastName}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td>{rolesByUser[u.id]?.join(", ")}</td>
                <td>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {ROLES.map(r => (
                      <button key={r} onClick={() => addRole(u.id, r)}>Add {r}</button>
                    ))}
                    {rolesByUser[u.id]?.map(r => (
                      <button key={`rm-${r}`} onClick={() => removeRole(u.id, r)}>Remove {r}</button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
