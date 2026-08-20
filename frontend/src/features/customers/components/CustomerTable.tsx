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

import type { Customer } from "../api/customers";
import { PERMISSIONS } from "@/features/auth/permissions";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingPage } from "@/components/common/LoadingPage";

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  hasSearch: boolean;
  onCreate: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerTable({
  customers,
  isLoading,
  hasSearch,
  onCreate,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  const { can } = usePermissions();

  const canCreate = can(
    PERMISSIONS.CUSTOMERS_CREATE,
  );

  const canEdit = can(
    PERMISSIONS.CUSTOMERS_EDIT,
  );

  const canDelete = can(
    PERMISSIONS.CUSTOMERS_DELETE,
  );

  const canShowActions =
    canEdit || canDelete;

  const columnCount =
    6 + (canShowActions ? 1 : 0);

  if (isLoading) {
    return (
      <LoadingPage
        message="Cargando clientes..."
        minHeight={240}
      />
    );
  }

  return (
    <TableContainer
      sx={{
        overflowX: "auto",
      }}
    >
      <Table
        sx={{
          minWidth: canShowActions
            ? 850
            : 760,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Empresa</TableCell>
            <TableCell>Contacto</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Estado</TableCell>

            {canShowActions && (
              <TableCell align="right">
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              hover
            >
              <TableCell>
                {customer.id}
              </TableCell>

              <TableCell>
                {customer.company_name}
              </TableCell>

              <TableCell>
                {customer.contact_name}
              </TableCell>

              <TableCell>
                {customer.email}
              </TableCell>

              <TableCell>
                {customer.phone}
              </TableCell>

              <TableCell>
                <Chip
                  label={
                    customer.is_active
                      ? "Activo"
                      : "Inactivo"
                  }
                  color={
                    customer.is_active
                      ? "success"
                      : "default"
                  }
                  size="small"
                />
              </TableCell>

              {canShowActions && (
                <TableCell align="right">
                  {canEdit && (
                    <Tooltip title="Editar cliente">
                      <IconButton
                        aria-label={`Editar ${customer.company_name}`}
                        onClick={() =>
                          onEdit(customer)
                        }
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}

                  {canDelete && (
                    <Tooltip title="Eliminar cliente">
                      <IconButton
                        color="error"
                        aria-label={`Eliminar ${customer.company_name}`}
                        onClick={() =>
                          onDelete(customer)
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

          {customers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                sx={{ p: 0 }}
              >
                <EmptyState
                  title={
                    hasSearch
                      ? "No se encontraron clientes"
                      : "No hay clientes registrados"
                  }
                  description={
                    hasSearch
                      ? "Prueba con otro nombre de empresa, contacto o correo electrónico."
                      : "Registra tu primer cliente para comenzar a gestionar oportunidades y actividades."
                  }
                  actionLabel={
                    !hasSearch && canCreate
                      ? "Nuevo cliente"
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