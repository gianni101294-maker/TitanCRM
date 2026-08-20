import type { FormEvent } from "react";
import { Add } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
} from "@mui/material";

import { PERMISSIONS } from "@/features/auth/permissions";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { UserDeleteDialog } from "../components/UserDeleteDialog";
import { UserFormDialog } from "../components/UserFormDialog";
import { UserTable } from "../components/UserTable";
import { useUsers } from "../hooks/useUsers";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export function UsersPage() {
  const {
    filteredUsers,

    searchTerm,
    setSearchTerm,

    isLoading,
    isSaving,
    isDeleting,

    errorMessage,
    setErrorMessage,

    successMessage,
    setSuccessMessage,

    formError,
    formData,

    isDialogOpen,
    editingUser,

    userToDelete,
    setUserToDelete,

    openCreateDialog,
    openEditDialog,
    closeUserDialog,

    updateField,
    saveUser,
    removeUser,
  } = useUsers();

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    void saveUser();
  }

  return (
    <DashboardLayout title="Usuarios">
      <PageHeader
        title="Usuarios"
        description="Administra usuarios, roles y accesos de TitanCRM."
        action={
          <PermissionGuard
            permission={
              PERMISSIONS.USERS_CREATE
            }
          >
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openCreateDialog}
            >
              Nuevo usuario
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
              placeholder="Buscar por nombre, correo, rol o estado"
            />
          </Box>

          <UserTable
            users={filteredUsers}
            isLoading={isLoading}
            hasSearch={Boolean(
              searchTerm.trim(),
            )}
            onCreate={openCreateDialog}
            onEdit={openEditDialog}
            onDelete={setUserToDelete}
          />
        </CardContent>
      </Card>

      <UserFormDialog
        open={isDialogOpen}
        user={editingUser}
        formData={formData}
        formError={formError}
        isSaving={isSaving}
        onClose={closeUserDialog}
        onSubmit={handleSubmit}
        onFieldChange={updateField}
      />

      <UserDeleteDialog
        user={userToDelete}
        isDeleting={isDeleting}
        onClose={() =>
          setUserToDelete(null)
        }
        onConfirm={() =>
          void removeUser()
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