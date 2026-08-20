import {
  useEffect,
  useRef,
  type FormEvent,
} from "react";

import {
  Add,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
} from "@mui/material";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ActivityDeleteDialog,
} from "../components/ActivityDeleteDialog";

import {
  ActivityFormDialog,
} from "../components/ActivityFormDialog";

import {
  ActivityTable,
} from "../components/ActivityTable";

import {
  PageHeader,
} from "@/components/common/PageHeader";

import {
  SearchBar,
} from "@/components/common/SearchBar";

import {
  useActivities,
} from "../hooks/useActivities";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

export function ActivitiesPage() {
  const navigate =
    useNavigate();

  const [
    searchParams,
  ] =
    useSearchParams();

  const handledSelectedId =
    useRef<
      number | null
    >(
      null,
    );

  const handledOpportunityId =
    useRef<
      number | null
    >(
      null,
    );

  const {
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
  } =
    useActivities();

  useEffect(() => {
    if (
      isLoading
    ) {
      return;
    }

    const selectedValue =
      searchParams.get(
        "selected",
      );

    if (
      !selectedValue
    ) {
      handledSelectedId.current =
        null;

      return;
    }

    const selectedId =
      Number(
        selectedValue,
      );

    if (
      !Number.isInteger(
        selectedId,
      ) ||
      selectedId <= 0
    ) {
      navigate(
        "/activities",
        {
          replace: true,
        },
      );

      return;
    }

    if (
      handledSelectedId.current ===
      selectedId
    ) {
      return;
    }

    const selectedActivity =
      activities.find(
        (activity) =>
          activity.id ===
          selectedId,
      );

    handledSelectedId.current =
      selectedId;

    if (
      !selectedActivity
    ) {
      setErrorMessage(
        "No se encontró la actividad seleccionada.",
      );

      navigate(
        "/activities",
        {
          replace: true,
        },
      );

      return;
    }

    openEditDialog(
      selectedActivity,
    );

    navigate(
      "/activities",
      {
        replace: true,
      },
    );
  }, [
    activities,
    isLoading,
    navigate,
    openEditDialog,
    searchParams,
    setErrorMessage,
  ]);

  useEffect(() => {
    if (
      isLoading
    ) {
      return;
    }

    const opportunityValue =
      searchParams.get(
        "opportunity",
      );

    if (
      !opportunityValue
    ) {
      handledOpportunityId.current =
        null;

      return;
    }

    const opportunityId =
      Number(
        opportunityValue,
      );

    if (
      !Number.isInteger(
        opportunityId,
      ) ||
      opportunityId <= 0
    ) {
      setErrorMessage(
        "La oportunidad indicada no es válida.",
      );

      navigate(
        "/activities",
        {
          replace: true,
        },
      );

      return;
    }

    if (
      handledOpportunityId.current ===
      opportunityId
    ) {
      return;
    }

    const opportunity =
      opportunities.find(
        (item) =>
          item.id ===
          opportunityId,
      );

    handledOpportunityId.current =
      opportunityId;

    if (
      !opportunity
    ) {
      setErrorMessage(
        "No se encontró la oportunidad seleccionada.",
      );

      navigate(
        "/activities",
        {
          replace: true,
        },
      );

      return;
    }

    openCreateDialog(
      opportunity,
    );

    navigate(
      "/activities",
      {
        replace: true,
      },
    );
  }, [
    isLoading,
    navigate,
    openCreateDialog,
    opportunities,
    searchParams,
    setErrorMessage,
  ]);

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    void saveActivity();
  }

  return (
    <DashboardLayout
      title="Actividades"
    >
      <PageHeader
        title="Actividades"
        description="Gestiona llamadas, reuniones, tareas y seguimientos."
        action={
          <Button
            variant="contained"
            startIcon={
              <Add />
            }
            onClick={() =>
              openCreateDialog()
            }
            disabled={
              customers.length ===
              0
            }
          >
            Nueva actividad
          </Button>
        }
      />

      {customers.length ===
        0 &&
        !isLoading && (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
            }}
          >
            Debes registrar al menos
            un cliente antes de crear
            una actividad.
          </Alert>
        )}

      {errorMessage && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
          onClose={() =>
            setErrorMessage(
              "",
            )
          }
        >
          {
            errorMessage
          }
        </Alert>
      )}

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow:
            "hidden",
        }}
      >
        <CardContent>
          <Box
            sx={{
              mb: 3,
            }}
          >
            <SearchBar
              value={
                searchTerm
              }
              onChange={
                setSearchTerm
              }
              placeholder="Buscar por título, cliente, oportunidad, tipo o estado"
            />
          </Box>

          <ActivityTable
            activities={
              filteredActivities
            }
            isLoading={
              isLoading
            }
            hasSearch={Boolean(
              searchTerm.trim(),
            )}
            onCreate={() =>
              openCreateDialog()
            }
            onEdit={
              openEditDialog
            }
            onDelete={
              setActivityToDelete
            }
            getCustomerName={
              getCustomerName
            }
          />
        </CardContent>
      </Card>

      <ActivityFormDialog
        open={
          isDialogOpen
        }
        activity={
          editingActivity
        }
        customers={
          customers
        }
        opportunities={
          availableOpportunities
        }
        formData={
          formData
        }
        formError={
          formError
        }
        isSaving={
          isSaving
        }
        onClose={
          closeActivityDialog
        }
        onSubmit={
          handleSubmit
        }
        onFieldChange={
          updateField
        }
      />

      <ActivityDeleteDialog
        activity={
          activityToDelete
        }
        isDeleting={
          isDeleting
        }
        onClose={() =>
          setActivityToDelete(
            null,
          )
        }
        onConfirm={() =>
          void removeActivity()
        }
      />

      <Snackbar
        open={Boolean(
          successMessage,
        )}
        autoHideDuration={
          3500
        }
        onClose={() =>
          setSuccessMessage(
            "",
          )
        }
        message={
          successMessage
        }
      />
    </DashboardLayout>
  );
}