import {
  USER_ROLES,
  type UserRole,
} from "./roles";

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",

  CUSTOMERS_VIEW: "customers.view",
  CUSTOMERS_CREATE: "customers.create",
  CUSTOMERS_EDIT: "customers.edit",
  CUSTOMERS_DELETE: "customers.delete",
  CUSTOMERS_EXPORT: "customers.export",

  OPPORTUNITIES_VIEW: "opportunities.view",
  OPPORTUNITIES_CREATE: "opportunities.create",
  OPPORTUNITIES_EDIT: "opportunities.edit",
  OPPORTUNITIES_DELETE: "opportunities.delete",
  OPPORTUNITIES_EXPORT: "opportunities.export",

  PIPELINE_VIEW: "pipeline.view",
  PIPELINE_MOVE: "pipeline.move",

  ACTIVITIES_VIEW: "activities.view",
  ACTIVITIES_CREATE: "activities.create",
  ACTIVITIES_EDIT: "activities.edit",
  ACTIVITIES_DELETE: "activities.delete",
  ACTIVITIES_EXPORT: "activities.export",

  REPORTS_VIEW: "reports.view",
  REPORTS_EXPORT_EXCEL: "reports.export.excel",
  REPORTS_EXPORT_PDF: "reports.export.pdf",
  REPORTS_EXPORT_CSV: "reports.export.csv",

  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_EDIT: "users.edit",
  USERS_DELETE: "users.delete",
  USERS_ASSIGN_ROLES: "users.assign_roles",

  SETTINGS_VIEW: "settings.view",
  SETTINGS_EDIT: "settings.edit",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const adminPermissions: Permission[] =
  Object.values(PERMISSIONS);

const supervisorPermissions: Permission[] = [
  PERMISSIONS.DASHBOARD_VIEW,

  PERMISSIONS.CUSTOMERS_VIEW,
  PERMISSIONS.CUSTOMERS_CREATE,
  PERMISSIONS.CUSTOMERS_EDIT,
  PERMISSIONS.CUSTOMERS_EXPORT,

  PERMISSIONS.OPPORTUNITIES_VIEW,
  PERMISSIONS.OPPORTUNITIES_CREATE,
  PERMISSIONS.OPPORTUNITIES_EDIT,
  PERMISSIONS.OPPORTUNITIES_EXPORT,

  PERMISSIONS.PIPELINE_VIEW,
  PERMISSIONS.PIPELINE_MOVE,

  PERMISSIONS.ACTIVITIES_VIEW,
  PERMISSIONS.ACTIVITIES_CREATE,
  PERMISSIONS.ACTIVITIES_EDIT,
  PERMISSIONS.ACTIVITIES_EXPORT,

  PERMISSIONS.REPORTS_VIEW,
  PERMISSIONS.REPORTS_EXPORT_EXCEL,
  PERMISSIONS.REPORTS_EXPORT_PDF,
  PERMISSIONS.REPORTS_EXPORT_CSV,
];

const salesPermissions: Permission[] = [
  PERMISSIONS.DASHBOARD_VIEW,

  PERMISSIONS.CUSTOMERS_VIEW,
  PERMISSIONS.CUSTOMERS_CREATE,
  PERMISSIONS.CUSTOMERS_EDIT,

  PERMISSIONS.OPPORTUNITIES_VIEW,
  PERMISSIONS.OPPORTUNITIES_CREATE,
  PERMISSIONS.OPPORTUNITIES_EDIT,

  PERMISSIONS.PIPELINE_VIEW,
  PERMISSIONS.PIPELINE_MOVE,

  PERMISSIONS.ACTIVITIES_VIEW,
  PERMISSIONS.ACTIVITIES_CREATE,
  PERMISSIONS.ACTIVITIES_EDIT,
];

export const permissionsByRole: Record<
  UserRole,
  readonly Permission[]
> = {
  [USER_ROLES.ADMIN]: adminPermissions,
  [USER_ROLES.SUPERVISOR]:
    supervisorPermissions,
  [USER_ROLES.SALES]: salesPermissions,
};

export function getPermissionsForRole(
  role: UserRole,
): readonly Permission[] {
  return permissionsByRole[role];
}

export function roleHasPermission(
  role: UserRole,
  permission: Permission,
) {
  return permissionsByRole[role].includes(
    permission,
  );
}