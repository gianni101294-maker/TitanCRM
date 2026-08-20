import type {
  FormEvent,
} from "react";

import {
  Add,
  Edit,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import type {
  Activity,
  ActivityCreate,
} from "../api/activities";

import type {
  Customer,
} from "@/features/customers";

import type {
  Opportunity,
} from "@/features/opportunities";

import {
  activityStatusOptions,
} from "../utils/activityStatus";

import {
  activityTypeOptions,
} from "../utils/activityType";

interface ActivityFormDialogProps {
  open: boolean;

  activity:
    Activity | null;

  customers:
    Customer[];

  opportunities:
    Opportunity[];

  formData:
    ActivityCreate;

  formError:
    string;

  isSaving:
    boolean;

  onClose:
    () => void;

  onSubmit: (
    event:
      FormEvent<HTMLFormElement>,
  ) => void;

  onFieldChange: <
    K extends keyof ActivityCreate,
  >(
    field: K,
    value: ActivityCreate[K],
  ) => void;
}

export function ActivityFormDialog({
  open,
  activity,
  customers,
  opportunities,
  formData,
  formError,
  isSaving,
  onClose,
  onSubmit,
  onFieldChange,
}: ActivityFormDialogProps) {
  const isEditing =
    Boolean(
      activity,
    );

  return (
    <Dialog
      open={open}
      onClose={
        isSaving
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="sm"
    >
      <Box
        component="form"
        onSubmit={onSubmit}
      >
        <DialogTitle>
          {isEditing
            ? "Editar actividad"
            : "Nueva actividad"}
        </DialogTitle>

        <DialogContent>
          {formError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
              }}
            >
              {formError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Título de la actividad"
            value={
              formData.title
            }
            onChange={(event) =>
              onFieldChange(
                "title",
                event.target.value,
              )
            }
            required
            margin="normal"
            autoFocus
          />

          <TextField
            fullWidth
            select
            label="Tipo de actividad"
            value={
              formData.activity_type
            }
            onChange={(event) =>
              onFieldChange(
                "activity_type",
                event.target.value,
              )
            }
            required
            margin="normal"
          >
            {activityTypeOptions.map(
              (option) => (
                <MenuItem
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {
                    option.label
                  }
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Descripción"
            value={
              formData.description
            }
            onChange={(event) =>
              onFieldChange(
                "description",
                event.target.value,
              )
            }
            margin="normal"
          />

          <TextField
            fullWidth
            type="datetime-local"
            label="Fecha y hora"
            value={
              formData.scheduled_at
            }
            onChange={(event) =>
              onFieldChange(
                "scheduled_at",
                event.target.value,
              )
            }
            required
            margin="normal"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            fullWidth
            select
            label="Estado"
            value={
              formData.status
            }
            onChange={(event) =>
              onFieldChange(
                "status",
                event.target.value,
              )
            }
            required
            margin="normal"
          >
            {activityStatusOptions.map(
              (option) => (
                <MenuItem
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {
                    option.label
                  }
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            fullWidth
            select
            label="Cliente"
            value={
              formData.customer_id
            }
            onChange={(event) =>
              onFieldChange(
                "customer_id",
                Number(
                  event.target.value,
                ),
              )
            }
            required
            margin="normal"
          >
            {customers.map(
              (customer) => (
                <MenuItem
                  key={
                    customer.id
                  }
                  value={
                    customer.id
                  }
                >
                  {
                    customer.company_name
                  }
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            fullWidth
            select
            label="Oportunidad"
            value={
              formData.opportunity_id ??
              ""
            }
            onChange={(event) => {
              const value =
                event.target.value;

              onFieldChange(
                "opportunity_id",
                value === ""
                  ? null
                  : Number(
                      value,
                    ),
              );
            }}
            margin="normal"
            helperText={
              opportunities.length > 0
                ? "Opcional. Solo se muestran oportunidades del cliente seleccionado."
                : "Este cliente no tiene oportunidades registradas."
            }
          >
            <MenuItem value="">
              Sin oportunidad
            </MenuItem>

            {opportunities.map(
              (opportunity) => (
                <MenuItem
                  key={
                    opportunity.id
                  }
                  value={
                    opportunity.id
                  }
                >
                  {
                    opportunity.title
                  }
                </MenuItem>
              ),
            )}
          </TextField>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={
              onClose
            }
            disabled={
              isSaving
            }
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={
              isSaving
            }
            startIcon={
              isSaving ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : isEditing ? (
                <Edit />
              ) : (
                <Add />
              )
            }
          >
            {isSaving
              ? "Guardando..."
              : isEditing
                ? "Actualizar"
                : "Guardar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}