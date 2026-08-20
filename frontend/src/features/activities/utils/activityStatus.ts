export const activityStatusOptions = [
  {
    value: "pending",
    label: "Pendiente",
    color: "warning",
  },
  {
    value: "completed",
    label: "Completada",
    color: "success",
  },
  {
    value: "cancelled",
    label: "Cancelada",
    color: "error",
  },
] as const;

export function getActivityStatusData(
  status: string,
) {
  return (
    activityStatusOptions.find(
      (option) => option.value === status,
    ) ?? {
      value: status,
      label: status,
      color: "default" as const,
    }
  );
}