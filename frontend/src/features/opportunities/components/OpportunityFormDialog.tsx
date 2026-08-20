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
  Customer,
} from "@/features/customers";

import type {
  User,
} from "@/features/users";

import type {
  Opportunity,
  OpportunityCreate,
  OpportunityPriority,
  OpportunityStage,
} from "../api/opportunities";

import {
  opportunityStageOptions,
} from "../utils/opportunityStage";

interface OpportunityFormDialogProps {
  open: boolean;

  opportunity:
    Opportunity | null;

  customers:
    Customer[];

  users:
    User[];

  formData:
    OpportunityCreate;

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
    K extends keyof OpportunityCreate,
  >(
    field: K,
    value: OpportunityCreate[K],
  ) => void;
}

export function OpportunityFormDialog({
  open,
  opportunity,
  customers,
  users,
  formData,
  formError,
  isSaving,
  onClose,
  onSubmit,
  onFieldChange,
}: OpportunityFormDialogProps) {
  const isEditing =
    Boolean(
      opportunity,
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
            ? "Editar oportunidad"
            : "Nueva oportunidad"}
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
            label="Título de la oportunidad"
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
            label="Responsable"
            value={
              formData.assigned_user_id ??
              ""
            }
            onChange={(event) => {
              const value =
                event.target.value;

              onFieldChange(
                "assigned_user_id",
                value === ""
                  ? null
                  : Number(
                      value,
                    ),
              );
            }}
            margin="normal"
            helperText="Selecciona quién será responsable de esta oportunidad."
          >
            <MenuItem value="">
              Sin asignar
            </MenuItem>

            {users.map(
              (user) => (
                <MenuItem
                  key={
                    user.id
                  }
                  value={
                    user.id
                  }
                >
                  {user.full_name}
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Valor de la oportunidad"
            value={
              formData.value === 0
                ? ""
                : formData.value
            }
            onChange={(event) => {
              const value =
                event.target.value;

              onFieldChange(
                "value",
                value === ""
                  ? 0
                  : Number(
                      value,
                    ),
              );
            }}
            required
            margin="normal"
            slotProps={{
              htmlInput: {
                min: 0,
                step: 0.01,
                inputMode:
                  "decimal",
              },
            }}
          />

          <TextField
            fullWidth
            select
            label="Etapa"
            value={
              formData.stage
            }
            onChange={(event) =>
              onFieldChange(
                "stage",
                event.target
                  .value as OpportunityStage,
              )
            }
            required
            margin="normal"
          >
            {opportunityStageOptions.map(
              (stage) => (
                <MenuItem
                  key={
                    stage.value
                  }
                  value={
                    stage.value
                  }
                >
                  {
                    stage.label
                  }
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            fullWidth
            select
            label="Prioridad"
            value={
              formData.priority
            }
            onChange={(event) =>
              onFieldChange(
                "priority",
                event.target
                  .value as OpportunityPriority,
              )
            }
            required
            margin="normal"
          >
            <MenuItem value="low">
              Baja
            </MenuItem>

            <MenuItem value="medium">
              Media
            </MenuItem>

            <MenuItem value="high">
              Alta
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Probabilidad de cierre (%)"
            value={
              formData.probability
            }
            onChange={(event) => {
              const value =
                event.target.value;

              onFieldChange(
                "probability",
                value === ""
                  ? 0
                  : Number(
                      value,
                    ),
              );
            }}
            required
            margin="normal"
            slotProps={{
              htmlInput: {
                min: 0,
                max: 100,
                step: 5,
              },
            }}
          />

          <TextField
            fullWidth
            type="date"
            label="Fecha estimada de cierre"
            value={
              formData
                .expected_close_date ??
              ""
            }
            onChange={(event) =>
              onFieldChange(
                "expected_close_date",
                event.target.value ||
                  null,
              )
            }
            margin="normal"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Notas"
            value={
              formData.notes ??
              ""
            }
            onChange={(event) =>
              onFieldChange(
                "notes",
                event.target.value ||
                  null,
              )
            }
            margin="normal"
          />
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
