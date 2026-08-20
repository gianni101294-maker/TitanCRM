import type {
  ReactNode,
} from "react";

import {
  CalendarMonth,
  Close,
  Edit,
  Flag,
  Notes,
  Percent,
  Person,
  Sell,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import type {
  Opportunity,
  OpportunityPriority,
} from "../api/opportunities";

import {
  StageChip,
} from "./StageChip";

import {
  OpportunityActivities,
} from "./OpportunityActivities";

interface OpportunityDetailDialogProps {
  open: boolean;

  opportunity:
    Opportunity | null;

  customerName: string;

  assignedUserName: string;

  canEdit: boolean;

  onClose: () => void;

  onEdit: (
    opportunity: Opportunity,
  ) => void;
}

interface DetailItemProps {
  icon: ReactNode;

  label: string;

  children: ReactNode;
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

function formatDate(
  value:
    | string
    | null,
) {
  if (!value) {
    return "Sin fecha definida";
  }

  const normalizedValue =
    value.slice(
      0,
      10,
    );

  const date =
    new Date(
      `${normalizedValue}T00:00:00`,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "es-PE",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );
}

function formatCreatedAt(
  value: string,
) {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Fecha no disponible";
  }

  return date.toLocaleDateString(
    "es-PE",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );
}

function getPriorityLabel(
  priority:
    OpportunityPriority,
) {
  switch (
    priority
  ) {
    case "high":
      return "Alta";

    case "medium":
      return "Media";

    case "low":
      return "Baja";

    default:
      return priority;
  }
}

function DetailItem({
  icon,
  label,
  children,
}: DetailItemProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems:
          "flex-start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          pt: 0.25,
          color:
            "text.secondary",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mb: 0.5,
          }}
        >
          {label}
        </Typography>

        {children}
      </Box>
    </Box>
  );
}

export function OpportunityDetailDialog({
  open,
  opportunity,
  customerName,
  assignedUserName,
  canEdit,
  onClose,
  onEdit,
}: OpportunityDetailDialogProps) {
  if (!opportunity) {
    return null;
  }

  const probability =
    Math.min(
      100,
      Math.max(
        0,
        Number(
          opportunity.probability,
        ),
      ),
    );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          position:
            "relative",
          pr: 7,
        }}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{
            display: "block",
          }}
        >
          Oportunidad #
          {opportunity.id}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          {
            opportunity.title
          }
        </Typography>

        <Tooltip
          title="Cerrar"
        >
          <IconButton
            aria-label="Cerrar detalle"
            onClick={
              onClose
            }
            sx={{
              position:
                "absolute",
              right: 16,
              top: 16,
            }}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Stack
          spacing={3}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <StageChip
              stage={
                opportunity.stage
              }
            />

            <Chip
              icon={
                <Flag />
              }
              label={`Prioridad ${getPriorityLabel(
                opportunity.priority,
              )}`}
              variant="outlined"
            />
          </Box>

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Stack
              spacing={3}
            >
              <DetailItem
                icon={
                  <Sell />
                }
                label="Valor de la oportunidad"
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  {formatCurrency(
                    opportunity.value,
                  )}
                </Typography>
              </DetailItem>

              <Divider />

              <DetailItem
                icon={
                  <Person />
                }
                label="Cliente"
              >
                <Typography
                  sx={{
                    fontWeight:
                      600,
                  }}
                >
                  {
                    customerName
                  }
                </Typography>
              </DetailItem>

              <Divider />

              <DetailItem
                icon={
                  <Person />
                }
                label="Responsable"
              >
                <Typography
                  sx={{
                    fontWeight:
                      600,
                  }}
                >
                  {
                    assignedUserName
                  }
                </Typography>
              </DetailItem>

              <Divider />

              <DetailItem
                icon={
                  <CalendarMonth />
                }
                label="Fecha estimada de cierre"
              >
                <Typography>
                  {formatDate(
                    opportunity.expected_close_date,
                  )}
                </Typography>
              </DetailItem>
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <DetailItem
              icon={
                <Percent />
              }
              label="Probabilidad de cierre"
            >
              <Stack
                spacing={1}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  {
                    probability
                  }
                  %
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={
                    probability
                  }
                  sx={{
                    height: 8,
                    borderRadius:
                      4,
                  }}
                />
              </Stack>
            </DetailItem>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <DetailItem
              icon={
                <Notes />
              }
              label="Notas"
            >
              <Typography
                sx={{
                  whiteSpace:
                    "pre-wrap",
                  overflowWrap:
                    "anywhere",
                }}
              >
                {opportunity.notes
                  ?.trim() ||
                  "No hay notas registradas para esta oportunidad."}
              </Typography>
            </DetailItem>
          </Paper>

          <OpportunityActivities
            opportunityId={
              opportunity.id
            }
          />

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Creada el{" "}
            {formatCreatedAt(
              opportunity.created_at,
            )}
          </Typography>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          onClick={
            onClose
          }
        >
          Cerrar
        </Button>

        {canEdit && (
          <Button
            variant="contained"
            startIcon={
              <Edit />
            }
            onClick={() => {
              onClose();

              onEdit(
                opportunity,
              );
            }}
          >
            Editar oportunidad
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}