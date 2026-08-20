import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Add,
  CalendarMonth,
  CheckCircle,
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
  ActivityFormDialog,
  ActivityStatusChip,
  ActivityTypeChip,
  createActivity,
  getActivitiesByOpportunity,
  updateActivity,
  type Activity,
  type ActivityCreate,
} from "@/features/activities";

import {
  PERMISSIONS,
} from "@/features/auth/permissions";

import {
  usePermissions,
} from "@/features/auth/hooks/usePermissions";

import type {
  ActivityStatus,
} from "@/features/activities/components/ActivityStatusChip";

import {
  getCustomers,
  type Customer,
} from "@/features/customers";

import {
  getOpportunities,
  type Opportunity,
} from "@/features/opportunities";

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
  const {
    can,
  } = usePermissions();

  const canEditActivities =
    can(
      PERMISSIONS.ACTIVITIES_EDIT,
    );

  const canCreateActivities =
    can(
      PERMISSIONS.ACTIVITIES_CREATE,
    );

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

  const [
    updatingActivityId,
    setUpdatingActivityId,
  ] = useState<number | null>(
    null,
  );

  const [
    isCreateDialogOpen,
    setIsCreateDialogOpen,
  ] = useState(false);

  const [
    editingActivity,
    setEditingActivity,
  ] = useState<Activity | null>(
    null,
  );

  const [
    isSavingActivity,
    setIsSavingActivity,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    customers,
    setCustomers,
  ] = useState<Customer[]>([]);

  const [
    opportunities,
    setOpportunities,
  ] = useState<Opportunity[]>([]);

  const [
    formData,
    setFormData,
  ] = useState<ActivityCreate>({
    title: "",
    activity_type: "task",
    description: "",
    scheduled_at: "",
    status: "pending",
    customer_id: 0,
    opportunity_id: opportunityId,
  });

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

  const sortedActivities =
    useMemo(
      () =>
        [...activities].sort(
          (
            first,
            second,
          ) =>
            new Date(
              second.scheduled_at,
            ).getTime() -
            new Date(
              first.scheduled_at,
            ).getTime(),
        ),
      [activities],
    );

  async function handleOpenActivity(
    activity: Activity,
  ) {
    if (!canEditActivities) {
      return;
    }

    setFormError("");
    setErrorMessage("");

    try {
      const [
        customerData,
        opportunityData,
      ] = await Promise.all([
        getCustomers(),
        getOpportunities(),
      ]);

      const activityCustomerId =
        activity.customer_id;

      setCustomers(customerData);

      setOpportunities(
        opportunityData.filter(
          (item) =>
            item.customer_id ===
            activityCustomerId,
        ),
      );

      const scheduledDate =
        new Date(
          activity.scheduled_at,
        );

      const scheduledAt =
        Number.isNaN(
          scheduledDate.getTime(),
        )
          ? activity.scheduled_at.slice(
              0,
              16,
            )
          : new Date(
              scheduledDate.getTime() -
                scheduledDate.getTimezoneOffset() *
                  60000,
            )
              .toISOString()
              .slice(0, 16);

      setFormData({
        title: activity.title,
        activity_type:
          activity.activity_type,
        description:
          activity.description ?? "",
        scheduled_at: scheduledAt,
        status: activity.status,
        customer_id:
          activity.customer_id,
        opportunity_id:
          activity.opportunity_id,
      });

      setEditingActivity(activity);
      setIsCreateDialogOpen(true);
    } catch {
      setErrorMessage(
        "No se pudo preparar la edición de la actividad.",
      );
    }
  }

  async function handleCreateActivity() {
    setEditingActivity(null);
    setFormError("");

    try {
      const [
        customerData,
        opportunityData,
      ] = await Promise.all([
        getCustomers(),
        getOpportunities(),
      ]);

      const currentOpportunity =
        opportunityData.find(
          (item) =>
            item.id === opportunityId,
        );

      if (!currentOpportunity) {
        setErrorMessage(
          "No se encontró la oportunidad seleccionada.",
        );
        return;
      }

      setCustomers(customerData);
      setOpportunities(
        opportunityData.filter(
          (item) =>
            item.customer_id ===
            currentOpportunity.customer_id,
        ),
      );

      const now = new Date();
      const localDate = new Date(
        now.getTime() -
          now.getTimezoneOffset() *
            60000,
      )
        .toISOString()
        .slice(0, 16);

      setFormData({
        title: "",
        activity_type: "task",
        description: "",
        scheduled_at: localDate,
        status: "pending",
        customer_id:
          currentOpportunity.customer_id,
        opportunity_id:
          currentOpportunity.id,
      });

      setIsCreateDialogOpen(true);
    } catch {
      setErrorMessage(
        "No se pudo preparar el formulario de actividad.",
      );
    }
  }

  function handleActivityFieldChange<
    K extends keyof ActivityCreate,
  >(
    field: K,
    value: ActivityCreate[K],
  ) {
    setFormData(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );

    if (
      field === "customer_id"
    ) {
      setFormData(
        (current) => ({
          ...current,
          customer_id:
            value as number,
          opportunity_id:
            value ===
            current.customer_id
              ? current.opportunity_id
              : null,
        }),
      );
    }
  }

  function handleCloseCreateDialog() {
    if (isSavingActivity) {
      return;
    }

    setIsCreateDialogOpen(false);
    setEditingActivity(null);
    setFormError("");
  }

  async function handleSaveActivity(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!formData.title.trim()) {
      setFormError(
        "Ingresa el título de la actividad.",
      );
      return;
    }

    if (!formData.customer_id) {
      setFormError(
        "Selecciona un cliente.",
      );
      return;
    }

    setIsSavingActivity(true);
    setFormError("");

    try {
      if (editingActivity) {
        const updatedActivity =
          await updateActivity(
            editingActivity.id,
            {
              ...formData,
              title:
                formData.title.trim(),
              opportunity_id:
                opportunityId,
            },
          );

        setActivities(
          (currentActivities) =>
            currentActivities.map(
              (currentActivity) =>
                currentActivity.id ===
                updatedActivity.id
                  ? updatedActivity
                  : currentActivity,
            ),
        );
      } else {
        const createdActivity =
          await createActivity({
            ...formData,
            title:
              formData.title.trim(),
            opportunity_id:
              opportunityId,
          });

        setActivities(
          (currentActivities) => [
            createdActivity,
            ...currentActivities,
          ],
        );
      }

      setIsCreateDialogOpen(false);
      setEditingActivity(null);
    } catch {
      setFormError(
        editingActivity
          ? "No se pudo actualizar la actividad."
          : "No se pudo crear la actividad.",
      );
    } finally {
      setIsSavingActivity(false);
    }
  }

  async function handleCompleteActivity(
    activity: Activity,
  ) {
    if (
      activity.status ===
      "completed"
    ) {
      return;
    }

    setUpdatingActivityId(
      activity.id,
    );

    setErrorMessage("");

    try {
      const updatedActivity =
        await updateActivity(
          activity.id,
          {
            title:
              activity.title,
            activity_type:
              activity.activity_type,
            description:
              activity.description,
            scheduled_at:
              activity.scheduled_at,
            status:
              "completed",
            customer_id:
              activity.customer_id,
            opportunity_id:
              activity.opportunity_id,
          },
        );

      setActivities(
        (
          currentActivities,
        ) =>
          currentActivities.map(
            (
              currentActivity,
            ) =>
              currentActivity.id ===
              updatedActivity.id
                ? updatedActivity
                : currentActivity,
          ),
      );
    } catch {
      setErrorMessage(
        "No se pudo completar la actividad.",
      );
    } finally {
      setUpdatingActivityId(
        null,
      );
    }
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
              Línea de tiempo comercial de esta oportunidad.
            </Typography>
          </Box>

          {canCreateActivities && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => {
                void handleCreateActivity();
              }}
            >
              Nueva actividad
            </Button>
          )}
        </Box>

        <Divider />

        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "center",
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
          activities.length ===
            0 && (
            <Box
              sx={{
                textAlign:
                  "center",
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
                Todavía no hay actividades relacionadas con esta oportunidad.
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
          sortedActivities.length >
            0 && (
            <Stack
              spacing={0}
            >
              {sortedActivities.map(
                (
                  activity,
                  index,
                ) => {
                  const status =
                    isActivityStatus(
                      activity.status,
                    )
                      ? activity.status
                      : "pending";

                  const isUpdating =
                    updatingActivityId ===
                    activity.id;

                  const isCompleted =
                    status ===
                    "completed";

                  const isLast =
                    index ===
                    sortedActivities.length -
                      1;

                  return (
                    <Box
                      key={
                        activity.id
                      }
                      sx={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          "30px 1fr",
                        columnGap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          position:
                            "relative",
                          display:
                            "flex",
                          justifyContent:
                            "center",
                        }}
                      >
                        {!isLast && (
                          <Box
                            sx={{
                              position:
                                "absolute",
                              top: 18,
                              bottom: -18,
                              width: 2,
                              bgcolor:
                                "divider",
                            }}
                          />
                        )}

                        <Box
                          sx={{
                            mt: 1,
                            width: 12,
                            height: 12,
                            borderRadius:
                              "50%",
                            bgcolor:
                              isCompleted
                                ? "success.main"
                                : "primary.main",
                            zIndex: 1,
                          }}
                        />
                      </Box>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          mb: isLast
                            ? 0
                            : 2,
                          borderRadius:
                            2,
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
                                minWidth:
                                  0,
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
                                  activity,
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

                          {canEditActivities &&
                            !isCompleted && (
                              <Box>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={
                                    isUpdating ? (
                                      <CircularProgress
                                        size={16}
                                        color="inherit"
                                      />
                                    ) : (
                                      <CheckCircle />
                                    )
                                  }
                                  disabled={
                                    isUpdating
                                  }
                                  onClick={() => {
                                    void handleCompleteActivity(
                                      activity,
                                    );
                                  }}
                                >
                                  {isUpdating
                                    ? "Completando..."
                                    : "Marcar como completada"}
                                </Button>
                              </Box>
                            )}
                        </Stack>
                      </Paper>
                    </Box>
                  );
                },
              )}
            </Stack>
          )}
      </Stack>
    <ActivityFormDialog
      open={isCreateDialogOpen}
      activity={editingActivity}
      customers={customers}
      opportunities={opportunities}
      formData={formData}
      formError={formError}
      isSaving={isSavingActivity}
      onClose={handleCloseCreateDialog}
      onSubmit={handleSaveActivity}
      onFieldChange={
        handleActivityFieldChange
      }
    />

    </Paper>
  );
}
