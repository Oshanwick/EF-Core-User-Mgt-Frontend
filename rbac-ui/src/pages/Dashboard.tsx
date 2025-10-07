
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { roles, logout } = useAuth();

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Dashboard</h1>
      <p>Your roles: {roles.length ? roles.join(", ") : "(none)"}</p>
      <div style={{ display: "flex", gap: 12 }}>
        <a href="/admin">Admin</a>
        <a href="/protected-user">User area</a>
        <a href="/protected-manager">Manager area</a>
        <a href="/protected-admin">Admin area</a>
      </div>
      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}
