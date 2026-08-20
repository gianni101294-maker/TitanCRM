import type { FormEvent } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";

import type {
  User,
  UserCreate,
} from "../api/users";
import {
  PERMISSIONS,
} from "@/features/auth/permissions";
import {
  roleOptions,
  type UserRole,
} from "@/features/auth/roles";
import { usePermissions } from "@/features/auth/hooks/usePermissions";

interface UserFormDialogProps {
  open: boolean;
  user: User | null;
  formData: UserCreate;
  formError: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
  onFieldChange: <
    K extends keyof UserCreate,
  >(
    field: K,
    value: UserCreate[K],
  ) => void;
}

export function UserFormDialog({
  open,
  user,
  formData,
  formError,
  isSaving,
  onClose,
  onSubmit,
  onFieldChange,
}: UserFormDialogProps) {
  const { can } = usePermissions();

  const canAssignRoles = can(
    PERMISSIONS.USERS_ASSIGN_ROLES,
  );

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={onSubmit}>
        <DialogTitle>
          {user
            ? "Editar usuario"
            : "Nuevo usuario"}
        </DialogTitle>

        <DialogContent
          sx={{
            pt: "16px !important",
            display: "grid",
            gap: 2,
          }}
        >
          {formError && (
            <Alert severity="error">
              {formError}
            </Alert>
          )}

          <TextField
            label="Nombre completo"
            value={formData.full_name}
            onChange={(event) =>
              onFieldChange(
                "full_name",
                event.target.value,
              )
            }
            disabled={isSaving}
            required
            autoFocus
            fullWidth
          />

          <TextField
            label="Correo electrónico"
            type="email"
            value={formData.email}
            onChange={(event) =>
              onFieldChange(
                "email",
                event.target.value,
              )
            }
            disabled={isSaving}
            required
            fullWidth
          />

          {!user && (
            <TextField
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(event) =>
                onFieldChange(
                  "password",
                  event.target.value,
                )
              }
              disabled={isSaving}
              required
              helperText="Mínimo 6 caracteres"
              fullWidth
            />
          )}

          <FormControl
            fullWidth
            disabled={
              isSaving || !canAssignRoles
            }
          >
            <InputLabel id="user-role-label">
              Rol
            </InputLabel>

            <Select
              labelId="user-role-label"
              label="Rol"
              value={formData.role}
              onChange={(event) =>
                onFieldChange(
                  "role",
                  event.target.value as UserRole,
                )
              }
            >
              {roleOptions.map((roleOption) => (
                <MenuItem
                  key={roleOption.value}
                  value={roleOption.value}
                >
                  {roleOption.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(event) =>
                  onFieldChange(
                    "is_active",
                    event.target.checked,
                  )
                }
                disabled={isSaving}
              />
            }
            label="Usuario activo"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
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
          >
            {isSaving
              ? "Guardando..."
              : user
                ? "Guardar cambios"
                : "Crear usuario"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}