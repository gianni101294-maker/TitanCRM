import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Add,
  CalendarMonth,
  OpenInNew,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  useNavigate,
} from "react-router-dom";

import {
  ActivityStatusChip,
  ActivityTypeChip,
  getActivitiesByOpportunity,
  type Activity,
} from "@/features/activities";

import type {
  ActivityStatus,
} from "@/features/activities/components/ActivityStatusChip";

interface OpportunityActivitiesProps {
  opportunityId: number;
}

function formatActivityDate(
  value: string,
) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Fecha no disponible";
  }

  return date.toLocaleString(
    "es-PE",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function isActivityStatus(
  status: string,
): status is ActivityStatus {
  return (
    status === "pending" ||
    status === "completed" ||
    status === "cancelled"
  );
}

export function OpportunityActivities({
  opportunityId,
}: OpportunityActivitiesProps) {
  const navigate = useNavigate();

  const [
    activities,
    setActivities,
  ] = useState<Activity[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const loadActivities =
    useCallback(
      async (
        showLoading = true,
      ) => {
        if (showLoading) {
          setIsLoading(true);
        }

        setErrorMessage("");

        try {
          const data =
            await getActivitiesByOpportunity(
              opportunityId,
            );

          setActivities(data);
        } catch {
          setErrorMessage(
            "No se pudieron cargar las actividades de esta oportunidad.",
          );
        } finally {
          setIsLoading(false);
        }
      },
      [opportunityId],
    );

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const data =
          await getActivitiesByOpportunity(
            opportunityId,
          );

        if (cancelled) {
          return;
        }

        setActivities(data);
        setErrorMessage("");
      } catch {
        if (cancelled) {
          return;
        }

        setErrorMessage(
          "No se pudieron cargar las actividades de esta oportunidad.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [opportunityId]);

  function handleOpenActivity(
    activityId: number,
  ) {
    navigate(
      `/activities?selected=${activityId}`,
    );
  }

  function handleCreateActivity() {
    navigate(
      `/activities?opportunity=${opportunityId}`,
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent:
              "space-between",
            gap: 2,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Actividades relacionadas
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Seguimiento comercial de esta
              oportunidad.
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={
              handleCreateActivity
            }
          >
            Nueva actividad
          </Button>
        </Box>

        <Divider />

        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CircularProgress
              size={28}
            />
          </Box>
        )}

        {!isLoading &&
          errorMessage && (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    void loadActivities();
                  }}
                >
                  Reintentar
                </Button>
              }
            >
              {errorMessage}
            </Alert>
          )}

        {!isLoading &&
          !errorMessage &&
          activities.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
              }}
            >
              <CalendarMonth
                sx={{
                  fontSize: 42,
                  color:
                    "text.disabled",
                  mb: 1,
                }}
              />

              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Sin actividades
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  mb: 2,
                }}
              >
                Todavía no hay actividades
                relacionadas con esta
                oportunidad.
              </Typography>

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={
                  handleCreateActivity
                }
              >
                Crear primera actividad
              </Button>
            </Box>
          )}

        {!isLoading &&
          !errorMessage &&
          activities.length > 0 && (
            <Stack
              spacing={1.5}
            >
              {activities.map(
                (activity) => {
                  const status =
                    isActivityStatus(
                      activity.status,
                    )
                      ? activity.status
                      : "pending";

                  return (
                    <Paper
                      key={activity.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                      }}
                    >
                      <Stack
                        spacing={1.5}
                      >
                        <Box
                          sx={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              minWidth: 0,
                              flex: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight:
                                  700,
                                overflowWrap:
                                  "anywhere",
                              }}
                            >
                              {
                                activity.title
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                              }}
                            >
                              {formatActivityDate(
                                activity.scheduled_at,
                              )}
                            </Typography>
                          </Box>

                          <Button
                            size="small"
                            endIcon={
                              <OpenInNew />
                            }
                            onClick={() =>
                              handleOpenActivity(
                                activity.id,
                              )
                            }
                          >
                            Abrir
                          </Button>
                        </Box>

                        <Box
                          sx={{
                            display:
                              "flex",
                            flexWrap:
                              "wrap",
                            alignItems:
                              "center",
                            gap: 1,
                          }}
                        >
                          <ActivityTypeChip
                            activityType={
                              activity.activity_type
                            }
                          />

                          <ActivityStatusChip
                            status={
                              status
                            }
                          />
                        </Box>

                        {activity.description
                          ?.trim() && (
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace:
                                "pre-wrap",
                              overflowWrap:
                                "anywhere",
                            }}
                          >
                            {
                              activity.description
                            }
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  );
                },
              )}
            </Stack>
          )}
      </Stack>
    </Paper>
  );
}
