import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCustomers,
  type Customer,
} from "@/features/customers";

import {
  getUsers,
  type User,
} from "@/features/users";

import {
  createOpportunity,
  deleteOpportunity,
  getOpportunities,
  updateOpportunity,
  type Opportunity,
  type OpportunityCreate,
  type OpportunityUpdate,
} from "../api/opportunities";

import {
  getOpportunityStageData,
} from "../utils/opportunityStage";

const initialForm: OpportunityCreate = {
  title: "",
  value: 0,
  stage: "prospect",
  priority: "medium",
  probability: 20,
  expected_close_date: null,
  notes: null,
  assigned_user_id: null,
  customer_id: 0,
};

export function useOpportunities() {
  const [
    opportunities,
    setOpportunities,
  ] = useState<Opportunity[]>([]);

  const [
    customers,
    setCustomers,
  ] = useState<Customer[]>([]);

  const [
    users,
    setUsers,
  ] = useState<User[]>([]);

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
    useState<OpportunityCreate>(
      initialForm,
    );

  const [
    editingOpportunity,
    setEditingOpportunity,
  ] =
    useState<Opportunity | null>(
      null,
    );

  const [
    opportunityToDelete,
    setOpportunityToDelete,
  ] =
    useState<Opportunity | null>(
      null,
    );

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const reloadOpportunities =
    useCallback(
      async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
          const [
            opportunityData,
            customerData,
            userData,
          ] =
            await Promise.all([
              getOpportunities(),
              getCustomers(),
              getUsers(),
            ]);

          setOpportunities(
            opportunityData,
          );

          setCustomers(
            customerData,
          );

          setUsers(
            userData,
          );
        } catch {
          setErrorMessage(
            "No se pudieron cargar las oportunidades.",
          );
        } finally {
          setIsLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [
          opportunityData,
          customerData,
          userData,
        ] =
          await Promise.all([
            getOpportunities(),
            getCustomers(),
            getUsers(),
          ]);

        if (isMounted) {
          setOpportunities(
            opportunityData,
          );

          setCustomers(
            customerData,
          );

          setUsers(
            userData,
          );

          setErrorMessage("");
        }
      } catch {
        if (isMounted) {
          setErrorMessage(
            "No se pudieron cargar las oportunidades.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  function openCreateDialog() {
    setEditingOpportunity(
      null,
    );

    setFormData({
      ...initialForm,

      customer_id:
        customers[0]?.id ?? 0,
    });

    setFormError("");

    setIsDialogOpen(true);
  }

  function openEditDialog(
    opportunity: Opportunity,
  ) {
    setEditingOpportunity(
      opportunity,
    );

    setFormData({
      title:
        opportunity.title,

      value:
        Number(
          opportunity.value,
        ),

      stage:
        opportunity.stage,

      priority:
        opportunity.priority,

      probability:
        opportunity.probability,

      expected_close_date:
        opportunity.expected_close_date,

      notes:
        opportunity.notes,

      assigned_user_id:
        opportunity.assigned_user_id,

      customer_id:
        opportunity.customer_id,
    });

    setFormError("");

    setIsDialogOpen(true);
  }

  function closeOpportunityDialog() {
    if (!isSaving) {
      setIsDialogOpen(false);

      setEditingOpportunity(
        null,
      );

      setFormData(
        initialForm,
      );

      setFormError("");
    }
  }

  function updateField<
    K extends keyof OpportunityCreate,
  >(
    field: K,
    value: OpportunityCreate[K],
  ) {
    setFormData(
      (currentForm) => ({
        ...currentForm,

        [field]: value,
      }),
    );
  }

  async function saveOpportunity() {
    if (
      formData.customer_id <= 0
    ) {
      setFormError(
        "Selecciona un cliente para la oportunidad.",
      );

      return false;
    }

    if (
      !formData.title.trim()
    ) {
      setFormError(
        "Ingresa un título para la oportunidad.",
      );

      return false;
    }

    if (
      Number(formData.value) <= 0
    ) {
      setFormError(
        "El valor de la oportunidad debe ser mayor que 0.",
      );

      return false;
    }

    if (
      formData.probability < 0 ||
      formData.probability > 100
    ) {
      setFormError(
        "La probabilidad debe estar entre 0 y 100.",
      );

      return false;
    }

    if (
      formData.assigned_user_id !== null
    ) {
      const assignedUser =
        users.find(
          (user) =>
            user.id ===
            formData.assigned_user_id,
        );

      if (!assignedUser) {
        setFormError(
          "El responsable seleccionado no existe.",
        );

        return false;
      }

      if (!assignedUser.is_active) {
        setFormError(
          "El responsable seleccionado se encuentra inactivo.",
        );

        return false;
      }
    }

    setFormError("");

    setIsSaving(true);

    try {
      if (editingOpportunity) {
        const updateData:
          OpportunityUpdate = {
            ...formData,
          };

        const updatedOpportunity =
          await updateOpportunity(
            editingOpportunity.id,
            updateData,
          );

        setOpportunities(
          (
            currentOpportunities,
          ) =>
            currentOpportunities.map(
              (opportunity) =>
                opportunity.id ===
                updatedOpportunity.id
                  ? updatedOpportunity
                  : opportunity,
            ),
        );

        setSuccessMessage(
          "Oportunidad actualizada correctamente.",
        );
      } else {
        const newOpportunity =
          await createOpportunity(
            formData,
          );

        setOpportunities(
          (
            currentOpportunities,
          ) => [
            ...currentOpportunities,
            newOpportunity,
          ],
        );

        setSuccessMessage(
          "Oportunidad creada correctamente.",
        );
      }

      setIsDialogOpen(false);

      setEditingOpportunity(
        null,
      );

      setFormData(
        initialForm,
      );

      return true;
    } catch {
      setFormError(
        "No se pudo guardar la oportunidad. Revisa los datos ingresados.",
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function removeOpportunity() {
    if (
      !opportunityToDelete
    ) {
      return false;
    }

    setIsDeleting(true);

    try {
      await deleteOpportunity(
        opportunityToDelete.id,
      );

      setOpportunities(
        (
          currentOpportunities,
        ) =>
          currentOpportunities.filter(
            (opportunity) =>
              opportunity.id !==
              opportunityToDelete.id,
          ),
      );

      setOpportunityToDelete(
        null,
      );

      setSuccessMessage(
        "Oportunidad eliminada correctamente.",
      );

      return true;
    } catch {
      setErrorMessage(
        "No se pudo eliminar la oportunidad.",
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

  const getUserName =
    useCallback(
      (
        userId:
          | number
          | null,
      ) => {
        if (userId === null) {
          return "Sin asignar";
        }

        const user =
          users.find(
            (item) =>
              item.id === userId,
          );

        return (
          user?.full_name ??
          "Usuario no encontrado"
        );
      },
      [users],
    );

  const activeUsers =
    useMemo(
      () =>
        users.filter(
          (user) =>
            user.is_active,
        ),
      [users],
    );

  const filteredOpportunities =
    useMemo(() => {
      const searchValue =
        searchTerm
          .toLowerCase()
          .trim();

      return opportunities.filter(
        (opportunity) => {
          const customerName =
            getCustomerName(
              opportunity.customer_id,
            ).toLowerCase();

          const assignedUserName =
            getUserName(
              opportunity.assigned_user_id,
            ).toLowerCase();

          const stageLabel =
            getOpportunityStageData(
              opportunity.stage,
            ).label.toLowerCase();

          return (
            opportunity.title
              .toLowerCase()
              .includes(
                searchValue,
              ) ||
            customerName.includes(
              searchValue,
            ) ||
            assignedUserName.includes(
              searchValue,
            ) ||
            stageLabel.includes(
              searchValue,
            ) ||
            opportunity.priority
              .toLowerCase()
              .includes(
                searchValue,
              )
          );
        },
      );
    }, [
      opportunities,
      searchTerm,
      getCustomerName,
      getUserName,
    ]);

  return {
    opportunities,
    filteredOpportunities,

    customers,

    users,
    activeUsers,

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

    editingOpportunity,

    opportunityToDelete,
    setOpportunityToDelete,

    isDeleting,

    openCreateDialog,
    openEditDialog,
    closeOpportunityDialog,

    updateField,

    saveOpportunity,

    removeOpportunity,

    getCustomerName,
    getUserName,

    reloadOpportunities,
  };
}
