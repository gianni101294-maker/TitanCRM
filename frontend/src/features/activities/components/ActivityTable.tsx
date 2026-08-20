import {
  Delete,
  Edit,
} from "@mui/icons-material";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import type { Activity } from "../api/activities";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingPage } from "@/components/common/LoadingPage";
import { ActivityStatusChip } from "./ActivityStatusChip";
import { ActivityTypeChip } from "./ActivityTypeChip";

interface ActivityTableProps {
  activities: Activity[];
  isLoading: boolean;
  hasSearch: boolean;
  onCreate: () => void;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
  getCustomerName: (customerId: number) => string;
}

function formatActivityDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function normalizeActivityStatus(
  status: string,
): "pending" | "completed" | "cancelled" {
  if (
    status === "completed" ||
    status === "cancelled"
  ) {
    return status;
  }

  return "pending";
}

export function ActivityTable({
  activities,
  isLoading,
  hasSearch,
  onCreate,
  onEdit,
  onDelete,
  getCustomerName,
}: ActivityTableProps) {
  if (isLoading) {
    return (
      <LoadingPage
        message="Cargando actividades..."
        minHeight={240}
      />
    );
  }

  return (
    <TableContainer
      sx={{
        overflowX: "auto",
      }}
    >
      <Table sx={{ minWidth: 980 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Fecha y hora</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {activities.map((activity) => (
            <TableRow
              key={activity.id}
              hover
            >
              <TableCell>
                {activity.id}
              </TableCell>

              <TableCell>
                <Typography
                  sx={{
                    fontWeight: 700,
                    overflowWrap: "anywhere",
                  }}
                >
                  {activity.title}
                </Typography>

                {activity.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.25,
                      maxWidth: 320,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {activity.description}
                  </Typography>
                )}
              </TableCell>

              <TableCell>
                <ActivityTypeChip
                  activityType={
                    activity.activity_type
                  }
                />
              </TableCell>

              <TableCell>
                {getCustomerName(
                  activity.customer_id,
                )}
              </TableCell>

              <TableCell>
                {formatActivityDate(
                  activity.scheduled_at,
                )}
              </TableCell>

              <TableCell>
                <ActivityStatusChip
                  status={normalizeActivityStatus(
                    activity.status,
                  )}
                />
              </TableCell>

              <TableCell align="right">
                <Tooltip title="Editar actividad">
                  <IconButton
                    aria-label={`Editar ${activity.title}`}
                    onClick={() => onEdit(activity)}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Eliminar actividad">
                  <IconButton
                    color="error"
                    aria-label={`Eliminar ${activity.title}`}
                    onClick={() => onDelete(activity)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}

          {activities.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                sx={{ p: 0 }}
              >
                <EmptyState
                  title={
                    hasSearch
                      ? "No se encontraron actividades"
                      : "No hay actividades registradas"
                  }
                  description={
                    hasSearch
                      ? "Prueba con otro título, cliente, tipo o estado."
                      : "Registra tu primera actividad para comenzar a organizar llamadas, reuniones y tareas."
                  }
                  actionLabel={
                    hasSearch
                      ? undefined
                      : "Nueva actividad"
                  }
                  onAction={
                    hasSearch
                      ? undefined
                      : onCreate
                  }
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}