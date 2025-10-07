import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminUsers from "./pages/AdminUsers";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";
import { LogOut, Shield, User, Settings, LayoutDashboard } from "lucide-react";

function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
              <Link to="/admin" className="text-gray-700 hover:text-indigo-600 font-medium">Admin</Link>
            </div>
            {isAuthed && (
              <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <LogOut size={18} />
              Logout
            </button>
            )}
          </div>
        </div>
      </nav>
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
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
