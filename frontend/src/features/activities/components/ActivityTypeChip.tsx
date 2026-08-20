interface ActivityTypeChipProps {
  activityType: string;
}

const activityTypeLabels = {
  call: "Llamada",
  meeting: "Reunión",
  task: "Tarea",
  email: "Correo",
} as const;

export function ActivityTypeChip({
  activityType,
}: ActivityTypeChipProps) {
  return (
    <>
      {activityTypeLabels[
        activityType as keyof typeof activityTypeLabels
      ] ?? activityType}
    </>
  );
}