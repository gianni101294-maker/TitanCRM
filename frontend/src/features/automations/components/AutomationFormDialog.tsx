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
  Stack,
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


const delayOptions = [
  {
    label: "Inmediatamente",
    value: 0,
  },
  {
    label: "1 día después",
    value: 1,
  },
  {
    label: "3 días después",
    value: 3,
  },
  {
    label: "7 días después",
    value: 7,
  },
];


const priorityOptions = [
  {
    label: "Baja",
    value: "low",
  },
  {
    label: "Media",
    value: "medium",
  },
  {
    label: "Alta",
    value: "high",
  },
];


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

  const priority =
    typeof formData.conditions.priority === "string"
      ? formData.conditions.priority
      : "";

  const probabilityMin =
    typeof formData.conditions.probability_min ===
    "number"
      ? formData.conditions.probability_min
      : "";

  const valueMin =
    typeof formData.conditions.value_min ===
    "number"
      ? formData.conditions.value_min
      : "";

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

  const customTitle =
    typeof formData.action_config.title === "string"
      ? formData.action_config.title
      : "";

  const customDescription =
    typeof formData.action_config.description ===
    "string"
      ? formData.action_config.description
      : "";

  const hasPresetDelay = delayOptions.some(
    (option) => option.value === delayDays,
  );


  function changeStage(
    value: string,
  ) {
    onFieldChange(
      "conditions",
      {
        ...formData.conditions,
        stage: value,
      },
    );
  }


  function changeOptionalCondition(
    field: string,
    value: unknown,
  ) {
    const conditions = {
      ...formData.conditions,
    };

    if (
      value === ""
      || value === null
      || value === undefined
    ) {
      delete conditions[field];
    } else {
      conditions[field] = value;
    }

    onFieldChange(
      "conditions",
      conditions,
    );
  }


  function changeActivityType(
    value: string,
  ) {
    onFieldChange(
      "action_config",
      {
        ...formData.action_config,
        activity_type: value,
      },
    );
  }


  function changeDelayDays(
    value: number,
  ) {
    onFieldChange(
      "action_config",
      {
        ...formData.action_config,
        delay_days: value,
      },
    );
  }


  function changeCustomTitle(
    value: string,
  ) {
    onFieldChange(
      "action_config",
      {
        ...formData.action_config,
        title: value || undefined,
      },
    );
  }


  function changeCustomDescription(
    value: string,
  ) {
    onFieldChange(
      "action_config",
      {
        ...formData.action_config,
        description: value || undefined,
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
              changeStage(
                event.target.value,
              )
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

          <Box
            sx={{
              mt: 2,
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.default",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
              }}
            >
              Condiciones adicionales
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                mb: 1,
              }}
            >
              Son opcionales. Si agregas varias,
              todas deberán cumplirse para ejecutar
              la automatización.
            </Typography>

            <TextField
              fullWidth
              select
              label="Prioridad"
              value={priority}
              onChange={(event) =>
                changeOptionalCondition(
                  "priority",
                  event.target.value,
                )
              }
              margin="normal"
            >
              <MenuItem value="">
                Cualquier prioridad
              </MenuItem>

              {priorityOptions.map(
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
              label="Probabilidad mínima"
              value={probabilityMin}
              onChange={(event) => {
                const value =
                  event.target.value;

                changeOptionalCondition(
                  "probability_min",
                  value === ""
                    ? ""
                    : Number(value),
                );
              }}
              helperText={
                "Ejemplo: 60 significa una probabilidad igual o mayor al 60 %."
              }
              margin="normal"
              slotProps={{
                htmlInput: {
                  min: 0,
                  max: 100,
                  step: 1,
                },
              }}
            />

            <TextField
              fullWidth
              type="number"
              label="Valor mínimo de oportunidad (S/)"
              value={valueMin}
              onChange={(event) => {
                const value =
                  event.target.value;

                changeOptionalCondition(
                  "value_min",
                  value === ""
                    ? ""
                    : Number(value),
                );
              }}
              helperText={
                "Ejemplo: 20000 ejecutará la regla para oportunidades de S/ 20,000 o más."
              }
              margin="normal"
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 0.01,
                },
              }}
            />
          </Box>

          <Typography
            variant="subtitle1"
            sx={{
              mt: 3,
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

          <Typography
            variant="subtitle2"
            sx={{
              mt: 2.5,
              mb: 1,
              fontWeight: 700,
            }}
          >
            Programación
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              mb: 1,
              flexWrap: "wrap",
            }}
          >
            {delayOptions.map(
              (option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={
                    delayDays === option.value
                      ? "contained"
                      : "outlined"
                  }
                  size="small"
                  onClick={() =>
                    changeDelayDays(
                      option.value,
                    )
                  }
                >
                  {option.label}
                </Button>
              ),
            )}
          </Stack>

          <TextField
            fullWidth
            type="number"
            label="Días personalizados"
            value={
              hasPresetDelay
                ? ""
                : delayDays
            }
            onChange={(event) => {
              const value =
                event.target.value === ""
                  ? 0
                  : Math.max(
                      0,
                      Number(
                        event.target.value,
                      ),
                    );

              changeDelayDays(value);
            }}
            helperText={
              "Puedes usar una opción rápida o indicar otra cantidad de días."
            }
            margin="normal"
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
              },
            }}
          />

          <Box
            sx={{
              mt: 3,
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.default",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
              }}
            >
              Personalización de la actividad
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                mb: 2,
              }}
            >
              Estos campos son opcionales. Si los
              dejas vacíos, TitanCRM generará el
              título y la descripción automáticamente.
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mb: 0.75,
                fontWeight: 600,
              }}
            >
              Título personalizado
            </Typography>

            <TextField
              fullWidth
              value={customTitle}
              onChange={(event) =>
                changeCustomTitle(
                  event.target.value,
                )
              }
              placeholder="Ejemplo: Preparar documentación de cierre"
              margin="normal"
            />

            <Typography
              variant="body2"
              sx={{
                mt: 1.5,
                mb: 0.75,
                fontWeight: 600,
              }}
            >
              Descripción de la actividad
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={3}
              value={customDescription}
              onChange={(event) =>
                changeCustomDescription(
                  event.target.value,
                )
              }
              placeholder="Ejemplo: Preparar documentación y pasos posteriores al cierre de la oportunidad."
              margin="normal"
            />
          </Box>

          <FormControlLabel
            sx={{
              mt: 2,
            }}
            control={
              <Switch
                checked={
                  formData.is_active
                }
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