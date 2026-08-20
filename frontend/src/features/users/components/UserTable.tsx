import {
  Delete,
  Edit,
} from "@mui/icons-material";
import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

import type { User } from "../api/users";
import { PERMISSIONS } from "@/features/auth/permissions";
import { getRoleLabel } from "@/features/auth/roles";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingPage } from "@/components/common/LoadingPage";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  hasSearch: boolean;
  onCreate: () => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
  }).format(date);
}

export function UserTable({
  users,
  isLoading,
  hasSearch,
  onCreate,
  onEdit,
  onDelete,
}: UserTableProps) {
  const { can } = usePermissions();

  const canCreate = can(
    PERMISSIONS.USERS_CREATE,
  );

  const canEdit = can(
    PERMISSIONS.USERS_EDIT,
  );

  const canDelete = can(
    PERMISSIONS.USERS_DELETE,
  );

  const canShowActions =
    canEdit || canDelete;

  const columnCount =
    6 + (canShowActions ? 1 : 0);

  if (isLoading) {
    return (
      <LoadingPage
        message="Cargando usuarios..."
        minHeight={240}
      />
    );
  }

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table
        sx={{
          minWidth: canShowActions
            ? 900
            : 800,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Registro</TableCell>

            {canShowActions && (
              <TableCell align="right">
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              hover
            >
              <TableCell>{user.id}</TableCell>

              <TableCell>
                {user.full_name}
              </TableCell>

              <TableCell>
                {user.email}
              </TableCell>

              <TableCell>
                <Chip
                  label={getRoleLabel(user.role)}
                  size="small"
                  color={
                    user.role === "admin"
                      ? "primary"
                      : user.role === "supervisor"
                        ? "secondary"
                        : "default"
                  }
                />
              </TableCell>

              <TableCell>
                <Chip
                  label={
                    user.is_active
                      ? "Activo"
                      : "Inactivo"
                  }
                  size="small"
                  color={
                    user.is_active
                      ? "success"
                      : "default"
                  }
                />
              </TableCell>

              <TableCell>
                {formatDate(user.created_at)}
              </TableCell>

              {canShowActions && (
                <TableCell align="right">
                  {canEdit && (
                    <Tooltip title="Editar usuario">
                      <IconButton
                        aria-label={`Editar ${user.full_name}`}
                        onClick={() =>
                          onEdit(user)
                        }
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}

                  {canDelete && (
                    <Tooltip title="Eliminar usuario">
                      <IconButton
                        color="error"
                        aria-label={`Eliminar ${user.full_name}`}
                        onClick={() =>
                          onDelete(user)
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}

          {users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                sx={{ p: 0 }}
              >
                <EmptyState
                  title={
                    hasSearch
                      ? "No se encontraron usuarios"
                      : "No hay usuarios registrados"
                  }
                  description={
                    hasSearch
                      ? "Prueba con otro nombre, correo, rol o estado."
                      : "Registra el primer usuario para comenzar a administrar el acceso a TitanCRM."
                  }
                  actionLabel={
                    !hasSearch && canCreate
                      ? "Nuevo usuario"
                      : undefined
                  }
                  onAction={
                    !hasSearch && canCreate
                      ? onCreate
                      : undefined
                  }
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}