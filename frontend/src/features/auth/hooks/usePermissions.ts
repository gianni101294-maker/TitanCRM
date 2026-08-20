import {
  useCallback,
  useMemo,
} from "react";

import {
  getPermissionsForRole,
  roleHasPermission,
  type Permission,
} from "../permissions";
import {
  isUserRole,
  type UserRole,
} from "../roles";

const USER_STORAGE_KEY =
  "titancrm_user";

interface StoredSessionUser {
  id?: unknown;
  full_name?: unknown;
  email?: unknown;
  role?: unknown;
  is_active?: unknown;
}

function getStoredRole():
  | UserRole
  | null {
  const storedUser =
    localStorage.getItem(
      USER_STORAGE_KEY,
    );

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser =
      JSON.parse(
        storedUser,
      ) as StoredSessionUser;

    if (
      typeof parsedUser.role ===
        "string" &&
      isUserRole(parsedUser.role)
    ) {
      return parsedUser.role;
    }

    return null;
  } catch {
    return null;
  }
}

export function usePermissions() {
  const role = getStoredRole();

  const permissions = useMemo(
    () =>
      role
        ? getPermissionsForRole(role)
        : [],
    [role],
  );

  const can = useCallback(
    (permission: Permission) => {
      if (!role) {
        return false;
      }

      return roleHasPermission(
        role,
        permission,
      );
    },
    [role],
  );

  const canAny = useCallback(
    (
      requiredPermissions:
        readonly Permission[],
    ) => {
      if (!role) {
        return false;
      }

      return requiredPermissions.some(
        (permission) =>
          roleHasPermission(
            role,
            permission,
          ),
      );
    },
    [role],
  );

  const canAll = useCallback(
    (
      requiredPermissions:
        readonly Permission[],
    ) => {
      if (!role) {
        return false;
      }

      return requiredPermissions.every(
        (permission) =>
          roleHasPermission(
            role,
            permission,
          ),
      );
    },
    [role],
  );

  return {
    role,
    permissions,
    can,
    canAny,
    canAll,
  };
}