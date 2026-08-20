import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import type { Permission } from "@/features/auth/permissions";
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
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <>{children}</>;
}