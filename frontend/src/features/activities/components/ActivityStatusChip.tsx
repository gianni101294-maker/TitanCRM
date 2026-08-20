import { Chip } from "@mui/material";

export type ActivityStatus =
  | "pending"
  | "completed"
  | "cancelled";

const statusMap = {
  pending: {
    label: "Pendiente",
    color: "warning",
  },
  completed: {
    label: "Completada",
    color: "success",
  },
  cancelled: {
    label: "Cancelada",
    color: "error",
  },
} as const;

interface ActivityStatusChipProps {
  status: ActivityStatus;
}

export function ActivityStatusChip({
  status,
}: ActivityStatusChipProps) {
  const statusData = statusMap[status];

  return (
    <Chip
      label={statusData.label}
      color={statusData.color}
      size="small"
    />
  );
}