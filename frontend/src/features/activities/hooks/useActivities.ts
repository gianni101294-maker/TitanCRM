import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
  type Activity,
  type ActivityCreate,
  type ActivityUpdate,
} from "../api/activities";

import {
  getCustomers,
  type Customer,
} from "@/features/customers";

import {
  getOpportunities,
  type Opportunity,
} from "@/features/opportunities";

import {
  getActivityStatusData,
} from "../utils/activityStatus";

import {
  getActivityTypeLabel,
} from "../utils/activityType";

function createInitialForm(): ActivityCreate {
  const now = new Date();

  now.setMinutes(
    now.getMinutes() -
      now.getTimezoneOffset(),
  );

  return {
    title: "",
    activity_type: "task",
    description: "",
    scheduled_at: now
      .toISOString()
      .slice(0, 16),
    status: "pending",
    customer_id: 0,
    opportunity_id: null,
  };
}

function convertToLocalDateTime(
  dateValue: string,
) {
  const date = new Date(
    dateValue,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  date.setMinutes(
    date.getMinutes() -
      date.getTimezoneOffset(),
  );

  return date
    .toISOString()
    .slice(0, 16);
}

export function useActivities() {
  const [
    activities,
    setActivities,
  ] =
    useState<Activity[]>(
      [],
    );

  const [
    customers,
    setCustomers,
  ] =
    useState<Customer[]>(
      [],
    );

  const [
    opportunities,
    setOpportunities,
  ] =
    useState<Opportunity[]>(
      [],
    );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    isDialogOpen,
    setIsDialogOpen,
  ] = useState(false);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    formData,
    setFormData,
  ] =
    useState<ActivityCreate>(
      createInitialForm(),
    );

  const [
    editingActivity,
    setEditingActivity,
  ] =
    useState<Activity | null>(
      null,
    );

  const [
    activityToDelete,
    setActivityToDelete,
  ] =
    useState<Activity | null>(
      null,
    );

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const reloadActivities =
    useCallback(
      async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
          const [
            activityData,
            customerData,
            opportunityData,
          ] =
            await Promise.all([
              getActivities(),
              getCustomers(),
              getOpportunities(),
            ]);

          setActivities(
            activityData,
          );

          setCustomers(
            customerData,
          );

          setOpportunities(
            opportunityData,
          );
        } catch {
          setErrorMessage(
            "No se pudieron cargar las actividades.",
          );
        } finally {
          setIsLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [
          activityData,
          customerData,
          opportunityData,
        ] =
          await Promise.all([
            getActivities(),
            getCustomers(),
            getOpportunities(),
          ]);

        if (isMounted) {
          setActivities(
            activityData,
          );

          setCustomers(
            customerData,
          );

          setOpportunities(
            opportunityData,
          );

          setErrorMessage("");
        }
      } catch {
        if (isMounted) {
          setErrorMessage(
            "No se pudieron cargar las actividades.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(
            false,
          );
        }
      }
    }

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  function openCreateDialog(
    opportunity?: Opportunity,
  ) {
    const initialForm =
      createInitialForm();

    setEditingActivity(
      null,
    );

    setFormData({
      ...initialForm,
      customer_id:
        opportunity?.customer_id ??
        customers[0]?.id ??
        0,
      opportunity_id:
        opportunity?.id ??
        null,
    });

    setFormError("");

    setIsDialogOpen(true);
  }

  function openEditDialog(
    activity: Activity,
  ) {
    setEditingActivity(
      activity,
    );

    setFormData({
      title:
        activity.title,

      activity_type:
        activity.activity_type,

      description:
        activity.description,

      scheduled_at:
        convertToLocalDateTime(
          activity.scheduled_at,
        ),

      status:
        activity.status,

      customer_id:
        activity.customer_id,

      opportunity_id:
        activity.opportunity_id,
    });

    setFormError("");

    setIsDialogOpen(true);
  }

  function closeActivityDialog() {
    if (!isSaving) {
      setIsDialogOpen(false);

      setEditingActivity(
        null,
      );

      setFormData(
        createInitialForm(),
      );

      setFormError("");
    }
  }

  function updateField<
    K extends keyof ActivityCreate,
  >(
    field: K,
    value: ActivityCreate[K],
  ) {
    setFormData(
      (currentForm) => {
        const nextForm = {
          ...currentForm,
          [field]: value,
        };

        if (
          field ===
          "customer_id"
        ) {
          nextForm.opportunity_id =
            null;
        }

        return nextForm;
      },
    );
  }

  async function saveActivity() {
    if (
      formData.customer_id <= 0
    ) {
      setFormError(
        "Selecciona un cliente para la actividad.",
      );

      return false;
    }

    if (
      !formData.scheduled_at
    ) {
      setFormError(
        "Selecciona la fecha y hora de la actividad.",
      );

      return false;
    }

    if (
      formData.opportunity_id !==
      null
    ) {
      const selectedOpportunity =
        opportunities.find(
          (opportunity) =>
            opportunity.id ===
            formData.opportunity_id,
        );

      if (
        !selectedOpportunity
      ) {
        setFormError(
          "La oportunidad seleccionada no existe.",
        );

        return false;
      }

      if (
        selectedOpportunity.customer_id !==
        formData.customer_id
      ) {
        setFormError(
          "La oportunidad seleccionada no pertenece al cliente indicado.",
        );

        return false;
      }
    }

    const scheduledDate =
      new Date(
        formData.scheduled_at,
      );

    if (
      Number.isNaN(
        scheduledDate.getTime(),
      )
    ) {
      setFormError(
        "La fecha y hora ingresadas no son válidas.",
      );

      return false;
    }

    setFormError("");

    setIsSaving(true);

    const requestData:
      ActivityCreate = {
        ...formData,

        scheduled_at:
          scheduledDate.toISOString(),
      };

    try {
      if (
        editingActivity
      ) {
        const updateData:
          ActivityUpdate = {
            ...requestData,
          };

        const updatedActivity =
          await updateActivity(
            editingActivity.id,
            updateData,
          );

        setActivities(
          (
            currentActivities,
          ) =>
            currentActivities.map(
              (activity) =>
                activity.id ===
                updatedActivity.id
                  ? updatedActivity
                  : activity,
            ),
        );

        setSuccessMessage(
          "Actividad actualizada correctamente.",
        );
      } else {
        const newActivity =
          await createActivity(
            requestData,
          );

        setActivities(
          (
            currentActivities,
          ) => [
            ...currentActivities,
            newActivity,
          ],
        );

        setSuccessMessage(
          "Actividad creada correctamente.",
        );
      }

      setIsDialogOpen(false);

      setEditingActivity(
        null,
      );

      setFormData(
        createInitialForm(),
      );

      return true;
    } catch {
      setFormError(
        "No se pudo guardar la actividad. Revisa los datos ingresados.",
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function removeActivity() {
    if (
      !activityToDelete
    ) {
      return false;
    }

    setIsDeleting(true);

    try {
      await deleteActivity(
        activityToDelete.id,
      );

      setActivities(
        (
          currentActivities,
        ) =>
          currentActivities.filter(
            (activity) =>
              activity.id !==
              activityToDelete.id,
          ),
      );

      setActivityToDelete(
        null,
      );

      setSuccessMessage(
        "Actividad eliminada correctamente.",
      );

      return true;
    } catch {
      setErrorMessage(
        "No se pudo eliminar la actividad.",
      );

      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  const getCustomerName =
    useCallback(
      (
        customerId: number,
      ) => {
        const customer =
          customers.find(
            (item) =>
              item.id ===
              customerId,
          );

        return (
          customer
            ?.company_name ??
          "Cliente no encontrado"
        );
      },
      [customers],
    );

  const getOpportunityName =
    useCallback(
      (
        opportunityId:
          | number
          | null,
      ) => {
        if (
          opportunityId ===
          null
        ) {
          return "Sin oportunidad";
        }

        const opportunity =
          opportunities.find(
            (item) =>
              item.id ===
              opportunityId,
          );

        return (
          opportunity?.title ??
          "Oportunidad no encontrada"
        );
      },
      [opportunities],
    );

  const availableOpportunities =
    useMemo(
      () =>
        opportunities.filter(
          (opportunity) =>
            opportunity.customer_id ===
            formData.customer_id,
        ),
      [
        opportunities,
        formData.customer_id,
      ],
    );

  const filteredActivities =
    useMemo(() => {
      const searchValue =
        searchTerm
          .toLowerCase()
          .trim();

      return activities.filter(
        (activity) => {
          const customerName =
            getCustomerName(
              activity.customer_id,
            ).toLowerCase();

          const opportunityName =
            getOpportunityName(
              activity.opportunity_id,
            ).toLowerCase();

          const activityType =
            getActivityTypeLabel(
              activity.activity_type,
            ).toLowerCase();

          const activityStatus =
            getActivityStatusData(
              activity.status,
            ).label.toLowerCase();

          return (
            activity.title
              .toLowerCase()
              .includes(
                searchValue,
              ) ||
            activity.description
              .toLowerCase()
              .includes(
                searchValue,
              ) ||
            customerName.includes(
              searchValue,
            ) ||
            opportunityName.includes(
              searchValue,
            ) ||
            activityType.includes(
              searchValue,
            ) ||
            activityStatus.includes(
              searchValue,
            )
          );
        },
      );
    }, [
      activities,
      searchTerm,
      getCustomerName,
      getOpportunityName,
    ]);

  return {
    activities,

    filteredActivities,

    customers,

    opportunities,

    availableOpportunities,

    searchTerm,
    setSearchTerm,

    isLoading,

    errorMessage,
    setErrorMessage,

    successMessage,
    setSuccessMessage,

    isDialogOpen,

    isSaving,

    formData,

    formError,

    editingActivity,

    activityToDelete,
    setActivityToDelete,

    isDeleting,

    openCreateDialog,
    openEditDialog,
    closeActivityDialog,

    updateField,

    saveActivity,

    removeActivity,

    getCustomerName,
    getOpportunityName,

    reloadActivities,
  };
}
