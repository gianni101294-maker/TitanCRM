import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import type { Permission } from "@/features/auth/permissions";
import { PERMISSIONS } from "@/features/auth/permissions";
import { usePermissions } from "@/features/auth/hooks/usePermissions";

interface PermissionRouteProps {
  permission: Permission;
  children: ReactNode;
}

export function PermissionRoute({
  permission,
  children,
}: PermissionRouteProps) {
  const { can } = usePermissions();

  if (!can(permission)) {
    if (can(PERMISSIONS.CUSTOMERS_VIEW)) {
      return <Navigate to="/customers" replace />;
    }

    if (can(PERMISSIONS.OPPORTUNITIES_VIEW)) {
      return <Navigate to="/opportunities" replace />;
    }

    if (can(PERMISSIONS.PIPELINE_VIEW)) {
      return <Navigate to="/pipeline" replace />;
    }

    if (can(PERMISSIONS.ACTIVITIES_VIEW)) {
      return <Navigate to="/activities" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}