import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { UserRow } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Calendar, 
  Mail, 
  User, 
  AlertCircle, 
  Loader2, 
  ChevronDown, 
  Check 
} from "lucide-react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'; // A great library for accessible dropdowns

// --- Prerequisites ---
// You will need to install Radix UI for the dropdown component:
// npm install @radix-ui/react-dropdown-menu

const ROLES = ["User", "Manager", "Admin"];

const ROLE_COLORS: Record<string, string> = {
  User: "bg-blue-100 text-blue-800",
  Manager: "bg-green-100 text-green-800",
  Admin: "bg-purple-100 text-purple-800"
};

// A new Skeleton component for a better loading experience
const UserRowSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 md:p-6 border-b border-slate-100">
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse md:hidden"></div>
    </div>
    <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse hidden md:block"></div>
    <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse hidden md:block"></div>
    <div className="flex gap-2">
      <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
      <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
    </div>
    <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
  </div>
);

export default function AdminUsers() {
  const { token } = useAuth();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rolesByUser, setRolesByUser] = useState<Record<string, string[]>>({});
  
  // New state to track which user is currently being updated
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const authed = useMemo(() => !!token, [token]);

  async function load() {
    if (!token) return;
    setLoading(true);
    setErr("");
    try {
      const users = await api<UserRow[]>("/api/users", {}, token);
      setRows(users);

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

  useEffect(() => { if (authed) load(); }, [authed]);

  const handleRoleChange = async (userId: string, role: string, action: 'add' | 'remove') => {
    if (!token) return;
    setUpdatingUserId(userId);
    try {
      const method = action === 'add' ? 'POST' : 'DELETE';
      await api(`/api/users/${userId}/roles/${role}`, { method }, token);
      
      // Optimistically update the UI for a smoother experience
      setRolesByUser(prev => {
          const currentRoles = prev[userId] || [];
          if (action === 'add') {
              return { ...prev, [userId]: [...currentRoles, role] };
          } else {
              return { ...prev, [userId]: currentRoles.filter(r => r !== role) };
          }
      });

    } catch (error) {
      // Re-fetch all data on error to ensure consistency
      console.error("Failed to update role:", error);
      await load();
    }
    finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
              <p className="text-slate-600 mt-1">Manage user roles and permissions for {rows.length} users.</p>
            </div>
            <div className="flex items-center gap-2">
                <button 
                  onClick={() => load()}
                  disabled={loading || !!updatingUserId}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Refresh
                </button>
            </div>
        </div>

        {/* Error Message */}
        {err && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700 font-medium">{err}</p>
          </div>
        )}

        {/* Users List/Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Table Header for Desktop */}
          <div className="hidden md:grid md:grid-cols-5 gap-4 items-center px-6 py-4 bg-slate-100/70 border-b border-slate-200">
              <span className="font-semibold text-slate-600 text-sm">User</span>
              <span className="font-semibold text-slate-600 text-sm">Name</span>
              <span className="font-semibold text-slate-600 text-sm">Date Joined</span>
              <span className="font-semibold text-slate-600 text-sm">Roles</span>
              <span className="font-semibold text-slate-600 text-sm text-right">Actions</span>
          </div>

          {loading ? (
            // Render Skeleton Loaders
            Array.from({ length: 5 }).map((_, i) => <UserRowSkeleton key={i} />)
          ) : rows.length > 0 ? (
            // Render User Rows
            rows.map((u) => (
              <div
                key={u.id}
                className={`grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 md:p-6 border-b border-slate-100 transition-opacity ${
                  updatingUserId === u.id ? "opacity-50" : "opacity-100"
                }`}
              >
                {/* User Info (Email) */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center">
                    <User size={20} className="text-slate-500"/>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{u.email}</p>
                    <p className="text-slate-500 text-sm md:hidden">{u.firstName} {u.lastName}</p>
                  </div>
                </div>
                
                {/* Name (Desktop Only) */}
                <p className="text-slate-700 hidden md:block">{u.firstName} {u.lastName}</p>
                
                {/* Created At */}
                <p className="text-slate-600 text-sm">
                  <span className="font-semibold text-slate-500 md:hidden">Joined: </span>
                  {new Date(u.createdAt).toLocaleDateString()}
                </p>
                
                {/* Roles */}
                <div className="flex gap-2 flex-wrap">
                  {(rolesByUser[u.id] || []).map((role) => (
                    <span key={role} className={`px-2.5 py-0.5 ${ROLE_COLORS[role]} text-xs font-semibold rounded-full`}>
                      {role}
                    </span>
                  ))}
                  {(rolesByUser[u.id]?.length === 0) && <span className="text-slate-500 text-xs">No roles assigned</span>}
                </div>

                {/* Actions Dropdown */}
                <div className="flex justify-start md:justify-end">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button 
                        disabled={updatingUserId === u.id}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-wait"
                      >
                        {updatingUserId === u.id ? <Loader2 size={16} className="animate-spin" /> : 'Manage Roles'}
                        <ChevronDown size={16} />
                      </button>
                    </DropdownMenu.Trigger>
                    
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content 
                        className="bg-white rounded-lg shadow-2xl border border-slate-200 w-48 mt-1 p-1 z-10"
                        sideOffset={5}
                      >
                        <DropdownMenu.Label className="px-2 py-1.5 text-xs text-slate-500">Assign Roles</DropdownMenu.Label>
                        {ROLES.map((role) => {
                          const hasRole = rolesByUser[u.id]?.includes(role);
                          return (
                            <DropdownMenu.Item
                              key={role}
                              onSelect={() => handleRoleChange(u.id, role, hasRole ? 'remove' : 'add')}
                              className="flex items-center justify-between px-2 py-1.5 text-sm text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer focus:bg-slate-100 focus:outline-none"
                            >
                              <span>{role}</span>
                              {hasRole && <Check size={16} className="text-indigo-600" />}
                            </DropdownMenu.Item>
                          );
                        })}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>

              </div>
            ))
          ) : (
            // Empty State
            <div className="p-16 text-center">
              <Users className="mx-auto text-slate-300 mb-4" size={64} />
              <p className="text-slate-500 text-lg font-medium">No users found</p>
              <p className="text-slate-400 mt-1">There are no users in the system yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}