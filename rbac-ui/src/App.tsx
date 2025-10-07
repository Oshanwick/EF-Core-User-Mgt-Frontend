import { Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminUsers from "./pages/AdminUsers";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 16 }}>
      <nav style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={["Admin"]}><AdminUsers /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
