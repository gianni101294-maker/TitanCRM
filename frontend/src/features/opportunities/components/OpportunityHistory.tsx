import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle,
  Edit,
  Event,
  History,
  Timeline,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  getOpportunityEvents,
  type OpportunityEvent,
} from "../api/opportunities";

interface OpportunityHistoryProps {
  opportunityId: number;
}

function formatEventDate(
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

function getEventIcon(
  eventType: string,
) {
  switch (eventType) {
    case "activity_completed":
      return <CheckCircle fontSize="small" />;

    case "activity_created":
      return <Event fontSize="small" />;

    case "activity_updated":
      return <Edit fontSize="small" />;

    default:
      return <Timeline fontSize="small" />;
  }
}

export function OpportunityHistory({
  opportunityId,
}: OpportunityHistoryProps) {
  const [
    events,
    setEvents,
  ] = useState<OpportunityEvent[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      setLoading(true);
      setError("");

      try {
        const data =
          await getOpportunityEvents(
            opportunityId,
          );

        if (!active) {
          return;
        }

        setEvents(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        console.error(
          "Error loading opportunity history:",
          loadError,
        );

        setError(
          "No se pudo cargar el historial de la oportunidad.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadEvents();

    return () => {
      active = false;
    };
  }, [opportunityId]);

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
            alignItems: "center",
            gap: 1,
          }}
        >
          <History
            color="action"
          />

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Historial de oportunidad
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Registro de cambios y actividades
            </Typography>
          </Box>
        </Box>

        {loading && (
          <Box
            sx={{
              py: 3,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              size={28}
            />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {!loading &&
          !error &&
          events.length === 0 && (
            <Box
              sx={{
                py: 3,
                textAlign: "center",
              }}
            >
              <History
                sx={{
                  fontSize: 40,
                  color:
                    "text.disabled",
                  mb: 1,
                }}
              />

              <Typography
                color="text.secondary"
              >
                Todavía no hay eventos
                registrados.
              </Typography>
            </Box>
          )}

        {!loading &&
          !error &&
          events.length > 0 && (
            <Stack spacing={0}>
              {events.map(
                (
                  event,
                  index,
                ) => (
                  <Box
                    key={event.id}
                    sx={{
                      display: "flex",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection:
                          "column",
                        alignItems:
                          "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius:
                            "50%",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          bgcolor:
                            "action.hover",
                          color:
                            "primary.main",
                          flexShrink: 0,
                        }}
                      >
                        {getEventIcon(
                          event.event_type,
                        )}
                      </Box>

                      {index <
                        events.length -
                          1 && (
                        <Box
                          sx={{
                            width: "1px",
                            flex: 1,
                            minHeight:
                              28,
                            bgcolor:
                              "divider",
                          }}
                        />
                      )}
                    </Box>

                    <Box
                      sx={{
                        pb:
                          index <
                          events.length -
                            1
                            ? 3
                            : 0,
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight:
                            600,
                        }}
                      >
                        {event.title}
                      </Typography>

                      {event.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            whiteSpace:
                              "pre-wrap",
                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {
                            event.description
                          }
                        </Typography>
                      )}

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          mt: 0.75,
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatEventDate(
                            event.created_at,
                          )}
                        </Typography>

                        {event.user_id !==
                          null && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            • Usuario #
                            {event.user_id}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                ),
              )}
            </Stack>
          )}
      </Stack>
    </Paper>
  );
}
