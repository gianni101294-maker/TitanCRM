import {
  useEffect,
  useRef,
  type FormEvent,
} from "react";
import { Add } from "@mui/icons-material";
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

import { PERMISSIONS } from "@/features/auth/permissions";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { CustomerDeleteDialog } from "../components/CustomerDeleteDialog";
import { CustomerFormDialog } from "../components/CustomerFormDialog";
import { CustomerTable } from "../components/CustomerTable";
import { useCustomers } from "../hooks/useCustomers";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export function CustomersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handledSelectedId = useRef<number | null>(
    null,
  );

  const {
    customers,
    filteredCustomers,

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
    editingCustomer,

    customerToDelete,
    setCustomerToDelete,
    isDeleting,

    openCreateDialog,
    openEditDialog,
    closeCustomerDialog,
    updateField,
    saveCustomer,
    removeCustomer,
  } = useCustomers();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const selectedValue =
      searchParams.get("selected");

    if (!selectedValue) {
      handledSelectedId.current = null;
      return;
    }

    const selectedId = Number(selectedValue);

    if (
      !Number.isInteger(selectedId) ||
      selectedId <= 0
    ) {
      navigate("/customers", {
        replace: true,
      });

      return;
    }

    if (
      handledSelectedId.current === selectedId
    ) {
      return;
    }

    const selectedCustomer = customers.find(
      (customer) =>
        customer.id === selectedId,
    );

    handledSelectedId.current = selectedId;

    if (!selectedCustomer) {
      setErrorMessage(
        "No se encontró el cliente seleccionado.",
      );

      navigate("/customers", {
        replace: true,
      });

      return;
    }

    openEditDialog(selectedCustomer);

    navigate("/customers", {
      replace: true,
    });
  }, [
    customers,
    isLoading,
    navigate,
    openEditDialog,
    searchParams,
    setErrorMessage,
  ]);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    void saveCustomer();
  }

  return (
    <DashboardLayout title="Clientes">
      <PageHeader
        title="Clientes"
        description="Gestiona las empresas y contactos registrados."
        action={
          <PermissionGuard
            permission={
              PERMISSIONS.CUSTOMERS_CREATE
            }
          >
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openCreateDialog}
            >
              Nuevo cliente
            </Button>
          </PermissionGuard>
        }
      />

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() =>
            setErrorMessage("")
          }
        >
          {errorMessage}
        </Alert>
      )}

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por empresa, contacto o correo"
            />
          </Box>

          <CustomerTable
            customers={filteredCustomers}
            isLoading={isLoading}
            hasSearch={Boolean(
              searchTerm.trim(),
            )}
            onCreate={openCreateDialog}
            onEdit={openEditDialog}
            onDelete={setCustomerToDelete}
          />
        </CardContent>
      </Card>

      <CustomerFormDialog
        open={isDialogOpen}
        customer={editingCustomer}
        formData={formData}
        formError={formError}
        isSaving={isSaving}
        onClose={closeCustomerDialog}
        onSubmit={handleSubmit}
        onFieldChange={updateField}
      />

      <CustomerDeleteDialog
        customer={customerToDelete}
        isDeleting={isDeleting}
        onClose={() =>
          setCustomerToDelete(null)
        }
        onConfirm={() =>
          void removeCustomer()
        }
      />

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3500}
        onClose={() =>
          setSuccessMessage("")
        }
        message={successMessage}
      />
    </DashboardLayout>
  );
}