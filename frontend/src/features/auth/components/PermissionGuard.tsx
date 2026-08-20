import type { ReactNode } from "react";

import type { Permission } from "../permissions";
import { usePermissions } from "../hooks/usePermissions";

interface PermissionGuardProps {
  permission?: Permission;
  anyOf?: readonly Permission[];
  allOf?: readonly Permission[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const {
    can,
    canAny,
    canAll,
  } = usePermissions();

  const hasSinglePermission =
    permission ? can(permission) : true;

  const hasAnyPermission =
    anyOf && anyOf.length > 0
      ? canAny(anyOf)
      : true;

  const hasAllPermissions =
    allOf && allOf.length > 0
      ? canAll(allOf)
      : true;

  const isAllowed =
    hasSinglePermission &&
    hasAnyPermission &&
    hasAllPermissions;

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}