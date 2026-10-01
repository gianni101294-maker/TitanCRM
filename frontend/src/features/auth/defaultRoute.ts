import {
  USER_ROLES,
  type UserRole,
} from "./roles";

export function getDefaultRouteForRole(
  role: UserRole,
): string {
  switch (role) {
    case USER_ROLES.ADMIN:
    case USER_ROLES.SUPERVISOR:
      return "/dashboard";

    case USER_ROLES.SALES:
      return "/customers";

    default:
      return "/login";
  }
}