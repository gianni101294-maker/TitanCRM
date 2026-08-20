import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const accessToken = localStorage.getItem(
    "titancrm_access_token",
  );

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}