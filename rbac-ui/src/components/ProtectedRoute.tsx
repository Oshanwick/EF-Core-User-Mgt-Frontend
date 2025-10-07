import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
  roles?: string[]; // allowed roles
};

export default function ProtectedRoute({ children, roles }: Props) {
  const { isAuthed, roles: myRoles } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0) {
    const ok = myRoles.some(r => roles.includes(r));
    if (!ok) return <Navigate to="/not-authorized" replace />;
  }
  return <>{children}</>;
}
