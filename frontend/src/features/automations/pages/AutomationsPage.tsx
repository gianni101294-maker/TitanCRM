import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
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
  createAutomation,
  getAutomations,
  type AutomationRule,
  type AutomationRuleCreate,
} from "../index";

import {
  AutomationFormDialog,
} from "../components/AutomationFormDialog";

import {
  PageHeader,
} from "@/components/common/PageHeader";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

import {
  activityTypeOptions,
} from "@/features/activities/utils/activityType";

import {
  opportunityStageOptions,
} from "@/features/opportunities/utils/opportunityStage";


const priorityLabels: Record<
  string,
  string
> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};


const initialFormData: AutomationRuleCreate = {
  name: "",
  description: null,
  trigger_type: "opportunity_stage_changed",
  conditions: {
    stage: "proposal",
  },
  action_type: "create_activity",
  action_config: {
    activity_type: "call",
    delay_days: 0,
  },
  is_active: true,
};


function createInitialFormData(): AutomationRuleCreate {
  return {
    ...initialFormData,
    conditions: {
      ...initialFormData.conditions,
    },
    action_config: {
      ...initialFormData.action_config,
    },
  };
}


function getErrorMessage(
  error: unknown,
): string {
  if (
    typeof error === "object"
    && error !== null
    && "response" in error
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

  return "No se pudo completar la operación.";
}


function getStageLabel(
  automation: AutomationRule,
): string {
  const stage =
    automation.conditions.stage;

  if (typeof stage !== "string") {
    return "Sin condición";
  }

  const option =
    opportunityStageOptions.find(
      (item) =>
        item.value === stage,
    );

  return option?.label ?? stage;
}


function getActivityTypeLabel(
  automation: AutomationRule,
): string {
  const activityType =
    automation.action_config.activity_type;

  if (
    typeof activityType !== "string"
  ) {
    return "Actividad";
  }

  const option =
    activityTypeOptions.find(
      (item) =>
        item.value === activityType,
    );

  return (
    option?.label
    ?? activityType
  );
}


function getDelayLabel(
  automation: AutomationRule,
): string {
  const delayDays =
    automation.action_config.delay_days;

  if (
    typeof delayDays !== "number"
  ) {
    return "Sin programación";
  }

  if (delayDays === 0) {
    return "Inmediatamente";
  }

  if (delayDays === 1) {
    return "1 día después";
  }

  return `${delayDays} días después`;
}


function getActionSummary(
  automation: AutomationRule,
): string {
  if (
    automation.action_type
    !== "create_activity"
  ) {
    return automation.action_type;
  }

  return [
    getActivityTypeLabel(
      automation,
    ),
    getDelayLabel(
      automation,
    ),
  ].join(" · ");
}


function getExtraConditions(
  automation: AutomationRule,
): string[] {
  const conditions: string[] = [];

  const priority =
    automation.conditions.priority;

  if (
    typeof priority === "string"
  ) {
    conditions.push(
      `Prioridad: ${
        priorityLabels[priority]
        ?? priority
      }`,
    );
  }

  const probabilityMin =
    automation.conditions.probability_min;

  if (
    typeof probabilityMin === "number"
  ) {
    conditions.push(
      `Probabilidad ≥ ${probabilityMin}%`,
    );
  }

  const valueMin =
    automation.conditions.value_min;

  if (
    typeof valueMin === "number"
  ) {
    conditions.push(
      `Valor ≥ S/ ${valueMin.toLocaleString(
        "es-PE",
      )}`,
    );
  }

  return conditions;
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

  const [
    isFormOpen,
    setIsFormOpen,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState<AutomationRuleCreate>(
    createInitialFormData,
  );

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


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


  function openCreateDialog() {
    setFormData(
      createInitialFormData(),
    );

    setFormError("");
    setIsFormOpen(true);
  }


  function closeFormDialog() {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setFormError("");
  }


  function handleFieldChange<
    K extends keyof AutomationRuleCreate,
  >(
    field: K,
    value: AutomationRuleCreate[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSaving(true);
    setFormError("");

    try {
      await createAutomation(
        formData,
      );

      setIsFormOpen(false);

      await loadAutomations();
    } catch (error) {
      setFormError(
        getErrorMessage(error),
      );
    } finally {
      setIsSaving(false);
    }
  }


  return (
    <DashboardLayout title="Automatizaciones">
      <PageHeader
        title="Automatizaciones"
        description="Automatiza tareas y seguimientos comerciales de TitanCRM."
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreateDialog}
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
            (automation) => {
              const extraConditions =
                getExtraConditions(
                  automation,
                );

              return (
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
                        justifyContent:
                          "space-between",
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
                            Cuando:
                          </strong>{" "}
                          cambie la etapa de una
                          oportunidad
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.5,
                          }}
                        >
                          <strong>
                            Si:
                          </strong>{" "}
                          la nueva etapa es{" "}
                          <strong>
                            {
                              getStageLabel(
                                automation,
                              )
                            }
                          </strong>
                        </Typography>

                        {extraConditions.length > 0 && (
                          <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            sx={{
                              mt: 1.5,
                              flexWrap: "wrap",
                            }}
                          >
                            {extraConditions.map(
                              (condition) => (
                                <Chip
                                  key={condition}
                                  label={condition}
                                  size="small"
                                  variant="outlined"
                                />
                              ),
                            )}
                          </Stack>
                        )}

                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1.5,
                          }}
                        >
                          <strong>
                            Entonces:
                          </strong>{" "}
                          {
                            getActionSummary(
                              automation,
                            )
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
              );
            },
          )}
        </Stack>
      )}

      <AutomationFormDialog
        open={isFormOpen}
        automation={null}
        formData={formData}
        formError={formError}
        isSaving={isSaving}
        onClose={closeFormDialog}
        onSubmit={handleSubmit}
        onFieldChange={
          handleFieldChange
        }
      />
    </DashboardLayout>
  );
}