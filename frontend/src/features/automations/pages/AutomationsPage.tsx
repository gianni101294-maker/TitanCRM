import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  Add,
  AutoAwesome,
} from "@mui/icons-material";

import {
  getAutomations,
  type AutomationRule,
} from "../index";

import {
  PageHeader,
} from "@/components/common/PageHeader";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

function getErrorMessage(
  error: unknown,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            detail?: string;
          };
        };
      }
    ).response;

    if (response?.data?.detail) {
      return response.data.detail;
    }
  }

  return "No se pudieron cargar las automatizaciones.";
}

export function AutomationsPage() {
  const [
    automations,
    setAutomations,
  ] = useState<AutomationRule[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const loadAutomations =
    useCallback(async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data =
          await getAutomations();

        setAutomations(data);
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error),
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadAutomations();
  }, [loadAutomations]);

  return (
    <DashboardLayout title="Automatizaciones">
      <PageHeader
        title="Automatizaciones"
        description="Automatiza tareas y seguimientos comerciales de TitanCRM."
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            disabled
          >
            Nueva automatización
          </Button>
        }
      />

      {errorMessage && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                void loadAutomations();
              }}
            >
              Reintentar
            </Button>
          }
        >
          {errorMessage}
        </Alert>
      )}

      {isLoading ? (
        <Box
          sx={{
            minHeight: 250,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : automations.length === 0 ? (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              py: 7,
              textAlign: "center",
            }}
          >
            <AutoAwesome
              sx={{
                fontSize: 48,
                color: "text.secondary",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              No hay automatizaciones
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
              }}
            >
              Aquí aparecerán las reglas
              automáticas que configures.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {automations.map(
            (automation) => (
              <Card
                key={automation.id}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={2}
                    sx={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {automation.name}
                      </Typography>

                      {automation.description && (
                        <Typography
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                          }}
                        >
                          {
                            automation.description
                          }
                        </Typography>
                      )}

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 2,
                        }}
                      >
                        <strong>
                          Disparador:
                        </strong>{" "}
                        {
                          automation.trigger_type
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        <strong>
                          Acción:
                        </strong>{" "}
                        {
                          automation.action_type
                        }
                      </Typography>
                    </Box>

                    <Box>
                      <Chip
                        label={
                          automation.is_active
                            ? "Activa"
                            : "Inactiva"
                        }
                        color={
                          automation.is_active
                            ? "success"
                            : "default"
                        }
                        variant={
                          automation.is_active
                            ? "filled"
                            : "outlined"
                        }
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ),
          )}
        </Stack>
      )}
    </DashboardLayout>
  );
}
