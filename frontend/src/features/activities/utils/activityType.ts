export const activityTypeOptions = [
  {
    value: "call",
    label: "Llamada",
  },
  {
    value: "meeting",
    label: "Reunión",
  },
  {
    value: "task",
    label: "Tarea",
  },
  {
    value: "email",
    label: "Correo",
  },
] as const;

export function getActivityTypeLabel(
  activityType: string,
) {
  return (
    activityTypeOptions.find(
      (option) =>
        option.value === activityType,
    )?.label ?? activityType
  );
}