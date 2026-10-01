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
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import {
  activityTypeOptions,
} from "@/features/activities/utils/activityType";

import {
  opportunityStageOptions,
} from "@/features/opportunities/utils/opportunityStage";

import type {
  AutomationRule,
  AutomationRuleCreate,
} from "../types";

interface AutomationFormDialogProps {
  open: boolean;
  automation: AutomationRule | null;
  formData: AutomationRuleCreate;
  formError: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
  onFieldChange: <
    K extends keyof AutomationRuleCreate,
  >(
    field: K,
    value: AutomationRuleCreate[K],
  ) => void;
}

export function AutomationFormDialog({
  open,
  automation,
  formData,
  formError,
  isSaving,
  onClose,
  onSubmit,
  onFieldChange,
}: AutomationFormDialogProps) {
  const isEditing = Boolean(automation);

  const stage =
    typeof formData.conditions.stage === "string"
      ? formData.conditions.stage
      : "proposal";

  const activityType =
    typeof formData.action_config.activity_type ===
    "string"
      ? formData.action_config.activity_type
      : "call";

  const delayDays =
    typeof formData.action_config.delay_days ===
    "number"
      ? formData.action_config.delay_days
      : 0;

  function changeStage(value: string) {
    onFieldChange(
      "conditions",
      {
        ...formData.conditions,
        stage: value,
      },
    );
  }

  function changeActivityType(value: string) {
    onFieldChange(
      "action_config",
      {
        ...formData.action_config,
        activity_type: value,
      },
    );
  }

  function changeDelayDays(value: number) {
    onFieldChange(
      "action_config",
      {
        ...formData.action_config,
        delay_days: value,
      },
    );
  }

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
            ? "Editar automatización"
            : "Nueva automatización"}
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
            label="Nombre"
            value={formData.name}
            onChange={(event) =>
              onFieldChange(
                "name",
                event.target.value,
              )
            }
            required
            margin="normal"
            autoFocus
          />

          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Descripción"
            value={
              formData.description ?? ""
            }
            onChange={(event) =>
              onFieldChange(
                "description",
                event.target.value || null,
              )
            }
            margin="normal"
          />

          <Typography
            variant="subtitle1"
            sx={{
              mt: 3,
              fontWeight: 700,
            }}
          >
            Cuando
          </Typography>

          <TextField
            fullWidth
            select
            label="Disparador"
            value={formData.trigger_type}
            onChange={(event) =>
              onFieldChange(
                "trigger_type",
                event.target.value,
              )
            }
            required
            margin="normal"
          >
            <MenuItem
              value="opportunity_stage_changed"
            >
              Cambie la etapa de una oportunidad
            </MenuItem>
          </TextField>

          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
              fontWeight: 700,
            }}
          >
            Si
          </Typography>

          <TextField
            fullWidth
            select
            label="Nueva etapa"
            value={stage}
            onChange={(event) =>
              changeStage(event.target.value)
            }
            required
            margin="normal"
          >
            {opportunityStageOptions.map(
              (option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ),
            )}
          </TextField>

          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
              fontWeight: 700,
            }}
          >
            Entonces
          </Typography>

          <TextField
            fullWidth
            select
            label="Acción"
            value={formData.action_type}
            onChange={(event) =>
              onFieldChange(
                "action_type",
                event.target.value,
              )
            }
            required
            margin="normal"
          >
            <MenuItem value="create_activity">
              Crear una actividad
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Tipo de actividad"
            value={activityType}
            onChange={(event) =>
              changeActivityType(
                event.target.value,
              )
            }
            required
            margin="normal"
          >
            {activityTypeOptions.map(
              (option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Crear después de"
            value={delayDays}
            onChange={(event) =>
              changeDelayDays(
                Math.max(
                  0,
                  Number(event.target.value),
                ),
              )
            }
            helperText="Número de días después del cambio de etapa."
            required
            margin="normal"
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
              },
            }}
          />

          <FormControlLabel
            sx={{
              mt: 2,
            }}
            control={
              <Switch
                checked={formData.is_active}
                onChange={(event) =>
                  onFieldChange(
                    "is_active",
                    event.target.checked,
                  )
                }
              />
            }
            label="Automatización activa"
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
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
