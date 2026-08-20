export const USER_ROLES = {
  ADMIN: "admin",
  SUPERVISOR: "supervisor",
  SALES: "sales",
} as const;

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
}

export const roleOptions: RoleOption[] = [
  {
    value: USER_ROLES.ADMIN,
    label: "Administrador",
    description:
      "Acceso completo a todos los módulos, acciones y configuraciones.",
  },
  {
    value: USER_ROLES.SUPERVISOR,
    label: "Supervisor",
    description:
      "Puede supervisar la operación comercial y consultar reportes.",
  },
  {
    value: USER_ROLES.SALES,
    label: "Vendedor",
    description:
      "Gestiona clientes, oportunidades y actividades comerciales.",
  },
];

export function isUserRole(
  value: string | null | undefined,
): value is UserRole {
  return Object.values(USER_ROLES).includes(
    value as UserRole,
  );
}

export function getRoleLabel(role: UserRole) {
  return (
    roleOptions.find(
      (roleOption) => roleOption.value === role,
    )?.label ?? "Rol desconocido"
  );
}