import {
  AccessTime,
  CalendarMonth,
  CheckCircle,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import type { Activity } from "@/features/activities";

interface RecentActivityProps {
  activities: Activity[];
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusData(status: string) {
  if (status === "completed") {
    return {
      label: "Completada",
      color: "success" as const,
      avatarColor: "success.main",
      icon: <CheckCircle />,
    };
  }

  if (status === "cancelled") {
    return {
      label: "Cancelada",
      color: "error" as const,
      avatarColor: "error.main",
      icon: <CalendarMonth />,
    };
  }

  return {
    label: "Pendiente",
    color: "warning" as const,
    avatarColor: "warning.main",
    icon: <CalendarMonth />,
  };
}

export function RecentActivity({
  activities,
}: RecentActivityProps) {
  const latestActivities = [...activities]
    .sort(
      (first, second) =>
        new Date(second.scheduled_at).getTime() -
        new Date(first.scheduled_at).getTime(),
    )
    .slice(0, 6);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },
          "&:last-child": {
            pb: {
              xs: 2,
              sm: 2.5,
            },
          },
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 800,
            mb: 2,
          }}
        >
          Actividad reciente
        </Typography>

        <Stack spacing={2}>
          {latestActivities.map((activity) => {
            const statusData = getStatusData(
              activity.status,
            );

            return (
              <Box
                key={activity.id}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: statusData.avatarColor,
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                  }}
                >
                  {statusData.icon}
                </Avatar>

                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
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
                        overflowWrap: "anywhere",
                      }}
                    >
                      {activity.description}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      icon={<AccessTime />}
                      size="small"
                      label={formatDate(
                        activity.scheduled_at,
                      )}
                    />

                    <Chip
                      size="small"
                      color={statusData.color}
                      label={statusData.label}
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}

          {latestActivities.length === 0 && (
            <Typography color="text.secondary">
              No hay actividad reciente.
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}