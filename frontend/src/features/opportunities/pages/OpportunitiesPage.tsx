import {
  useEffect,
  useRef,
  useState,
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
  PERMISSIONS,
} from "@/features/auth/permissions";

import {
  PermissionGuard,
} from "@/features/auth/components/PermissionGuard";

import {
  usePermissions,
} from "@/features/auth/hooks/usePermissions";

import {
  PageHeader,
} from "@/components/common/PageHeader";

import {
  SearchBar,
} from "@/components/common/SearchBar";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

import type {
  Opportunity,
} from "../api/opportunities";

import {
  useOpportunities,
} from "../hooks/useOpportunities";

import {
  OpportunityDeleteDialog,
} from "../components/OpportunityDeleteDialog";

import {
  OpportunityDetailDialog,
} from "../components/OpportunityDetailDialog";

import {
  OpportunityFormDialog,
} from "../components/OpportunityFormDialog";

import {
  OpportunityTable,
} from "../components/OpportunityTable";

export function OpportunitiesPage() {
  const navigate =
    useNavigate();

  const [
    searchParams,
  ] =
    useSearchParams();

  const {
    can,
  } =
    usePermissions();

  const canEdit =
    can(
      PERMISSIONS.OPPORTUNITIES_EDIT,
    );

  const handledSelectedId =
    useRef<
      number | null
    >(
      null,
    );

  const [
    manuallySelectedOpportunity,
    setManuallySelectedOpportunity,
  ] =
    useState<
      Opportunity | null
    >(
      null,
    );

  const {
    opportunities,
    filteredOpportunities,

    customers,

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
  } =
    useOpportunities();

  const selectedValue =
    searchParams.get(
      "selected",
    );

  const selectedId =
    selectedValue
      ? Number(
          selectedValue,
        )
      : null;

  const urlSelectedOpportunity =
    selectedId !== null &&
    Number.isInteger(
      selectedId,
    ) &&
    selectedId > 0
      ? opportunities.find(
          (
            opportunity,
          ) =>
            opportunity.id ===
            selectedId,
        ) ?? null
      : null;

  const selectedOpportunity =
    manuallySelectedOpportunity ??
    urlSelectedOpportunity;

  useEffect(() => {
    if (
      isLoading
    ) {
      return;
    }

    if (
      !selectedValue
    ) {
      handledSelectedId.current =
        null;

      return;
    }

    if (
      selectedId === null ||
      !Number.isInteger(
        selectedId,
      ) ||
      selectedId <= 0
    ) {
      navigate(
        "/opportunities",
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

    handledSelectedId.current =
      selectedId;

    if (
      !urlSelectedOpportunity
    ) {
      setErrorMessage(
        "No se encontró la oportunidad seleccionada.",
      );

      navigate(
        "/opportunities",
        {
          replace: true,
        },
      );
    }
  }, [
    isLoading,
    navigate,
    selectedId,
    selectedValue,
    setErrorMessage,
    urlSelectedOpportunity,
  ]);

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    void saveOpportunity();
  }

  function handleViewOpportunity(
    opportunity:
      Opportunity,
  ) {
    setManuallySelectedOpportunity(
      opportunity,
    );
  }

  function handleCloseDetail() {
    setManuallySelectedOpportunity(
      null,
    );

    if (
      selectedValue
    ) {
      navigate(
        "/opportunities",
        {
          replace: true,
        },
      );
    }
  }

  function handleEditFromDetail(
    opportunity:
      Opportunity,
  ) {
    setManuallySelectedOpportunity(
      null,
    );

    if (
      selectedValue
    ) {
      navigate(
        "/opportunities",
        {
          replace: true,
        },
      );
    }

    openEditDialog(
      opportunity,
    );
  }

  return (
    <DashboardLayout
      title="Oportunidades"
    >
      <PageHeader
        title="Oportunidades"
        description="Gestiona tus negocios y oportunidades de venta."
        action={
          <PermissionGuard
            permission={
              PERMISSIONS.OPPORTUNITIES_CREATE
            }
          >
            <Button
              variant="contained"
              startIcon={
                <Add />
              }
              onClick={
                openCreateDialog
              }
              disabled={
                customers.length ===
                0
              }
            >
              Nueva oportunidad
            </Button>
          </PermissionGuard>
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
            una oportunidad.
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
              placeholder="Buscar por título, cliente, responsable, etapa o prioridad"
            />
          </Box>

          <OpportunityTable
            opportunities={
              filteredOpportunities
            }
            isLoading={
              isLoading
            }
            hasSearch={Boolean(
              searchTerm.trim(),
            )}
            onCreate={
              openCreateDialog
            }
            onView={
              handleViewOpportunity
            }
            onEdit={
              openEditDialog
            }
            onDelete={
              setOpportunityToDelete
            }
            getCustomerName={
              getCustomerName
            }
          />
        </CardContent>
      </Card>

      <OpportunityDetailDialog
        open={Boolean(
          selectedOpportunity,
        )}
        opportunity={
          selectedOpportunity
        }
        customerName={
          selectedOpportunity
            ? getCustomerName(
                selectedOpportunity.customer_id,
              )
            : ""
        }
        assignedUserName={
          selectedOpportunity
            ? getUserName(
                selectedOpportunity.assigned_user_id,
              )
            : "Sin asignar"
        }
        canEdit={
          canEdit
        }
        onClose={
          handleCloseDetail
        }
        onEdit={
          handleEditFromDetail
        }
      />

      <OpportunityFormDialog
        open={
          isDialogOpen
        }
        opportunity={
          editingOpportunity
        }
        customers={
          customers
        }
        users={
          activeUsers
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
          closeOpportunityDialog
        }
        onSubmit={
          handleSubmit
        }
        onFieldChange={
          updateField
        }
      />

      <OpportunityDeleteDialog
        opportunity={
          opportunityToDelete
        }
        isDeleting={
          isDeleting
        }
        onClose={() =>
          setOpportunityToDelete(
            null,
          )
        }
        onConfirm={() =>
          void removeOpportunity()
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