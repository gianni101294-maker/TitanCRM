import {
  Delete,
  Edit,
  Visibility,
} from "@mui/icons-material";

import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

import type {
  Opportunity,
} from "../api/opportunities";

import {
  PERMISSIONS,
} from "@/features/auth/permissions";

import {
  EmptyState,
} from "@/components/common/EmptyState";

import {
  LoadingPage,
} from "@/components/common/LoadingPage";

import {
  usePermissions,
} from "@/features/auth/hooks/usePermissions";

import {
  StageChip,
} from "./StageChip";

interface OpportunityTableProps {
  opportunities: Opportunity[];

  isLoading: boolean;

  hasSearch: boolean;

  onCreate: () => void;

  onView: (
    opportunity: Opportunity,
  ) => void;

  onEdit: (
    opportunity: Opportunity,
  ) => void;

  onDelete: (
    opportunity: Opportunity,
  ) => void;

  getCustomerName: (
    customerId: number,
  ) => string;
}

function formatCurrency(
  value:
    | number
    | string,
) {
  return Number(
    value,
  ).toLocaleString(
    "es-PE",
    {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    },
  );
}

export function OpportunityTable({
  opportunities,
  isLoading,
  hasSearch,
  onCreate,
  onView,
  onEdit,
  onDelete,
  getCustomerName,
}: OpportunityTableProps) {
  const {
    can,
  } = usePermissions();

  const canCreate =
    can(
      PERMISSIONS.OPPORTUNITIES_CREATE,
    );

  const canEdit =
    can(
      PERMISSIONS.OPPORTUNITIES_EDIT,
    );

  const canDelete =
    can(
      PERMISSIONS.OPPORTUNITIES_DELETE,
    );

  const canShowActions =
    canEdit ||
    canDelete;

  const columnCount =
    5 +
    1 +
    (canShowActions
      ? 1
      : 0);

  if (
    isLoading
  ) {
    return (
      <LoadingPage
        message="Cargando oportunidades..."
        minHeight={240}
      />
    );
  }

  return (
    <TableContainer
      sx={{
        overflowX:
          "auto",
      }}
    >
      <Table
        sx={{
          minWidth:
            canShowActions
              ? 860
              : 760,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              ID
            </TableCell>

            <TableCell>
              Título
            </TableCell>

            <TableCell>
              Cliente
            </TableCell>

            <TableCell>
              Valor
            </TableCell>

            <TableCell>
              Etapa
            </TableCell>

            <TableCell
              align="center"
            >
              Detalle
            </TableCell>

            {canShowActions && (
              <TableCell
                align="right"
              >
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {opportunities.map(
            (
              opportunity,
            ) => (
              <TableRow
                key={
                  opportunity.id
                }
                hover
              >
                <TableCell>
                  {
                    opportunity.id
                  }
                </TableCell>

                <TableCell>
                  {
                    opportunity.title
                  }
                </TableCell>

                <TableCell>
                  {getCustomerName(
                    opportunity.customer_id,
                  )}
                </TableCell>

                <TableCell>
                  {formatCurrency(
                    opportunity.value,
                  )}
                </TableCell>

                <TableCell>
                  <StageChip
                    stage={
                      opportunity.stage
                    }
                  />
                </TableCell>

                <TableCell
                  align="center"
                >
                  <Tooltip
                    title="Ver detalle"
                  >
                    <IconButton
                      aria-label={`Ver detalle de ${opportunity.title}`}
                      onClick={() =>
                        onView(
                          opportunity,
                        )
                      }
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                {canShowActions && (
                  <TableCell
                    align="right"
                  >
                    {canEdit && (
                      <Tooltip
                        title="Editar oportunidad"
                      >
                        <IconButton
                          aria-label={`Editar ${opportunity.title}`}
                          onClick={() =>
                            onEdit(
                              opportunity,
                            )
                          }
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}

                    {canDelete && (
                      <Tooltip
                        title="Eliminar oportunidad"
                      >
                        <IconButton
                          color="error"
                          aria-label={`Eliminar ${opportunity.title}`}
                          onClick={() =>
                            onDelete(
                              opportunity,
                            )
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ),
          )}

          {opportunities.length ===
            0 && (
            <TableRow>
              <TableCell
                colSpan={
                  columnCount
                }
                sx={{
                  p: 0,
                }}
              >
                <EmptyState
                  title={
                    hasSearch
                      ? "No se encontraron oportunidades"
                      : "No hay oportunidades registradas"
                  }
                  description={
                    hasSearch
                      ? "Prueba con otro título, cliente o etapa."
                      : "Registra tu primera oportunidad para comenzar a gestionar el proceso comercial."
                  }
                  actionLabel={
                    !hasSearch &&
                    canCreate
                      ? "Nueva oportunidad"
                      : undefined
                  }
                  onAction={
                    !hasSearch &&
                    canCreate
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
