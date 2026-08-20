import type { FormEvent } from "react";
import { Add, Edit } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import type {
  Customer,
  CustomerCreate,
} from "../api/customers";

interface CustomerFormDialogProps {
  open: boolean;
  customer: Customer | null;
  formData: CustomerCreate;
  formError: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: (
    field: keyof CustomerCreate,
    value: string,
  ) => void;
}

export function CustomerFormDialog({
  open,
  customer,
  formData,
  formError,
  isSaving,
  onClose,
  onSubmit,
  onFieldChange,
}: CustomerFormDialogProps) {
  const isEditing = Boolean(customer);

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <Box
        component="form"
        onSubmit={onSubmit}
      >
        <DialogTitle>
          {isEditing
            ? "Editar cliente"
            : "Nuevo cliente"}
        </DialogTitle>

        <DialogContent>
          {formError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {formError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nombre de la empresa"
            value={formData.company_name}
            onChange={(event) =>
              onFieldChange(
                "company_name",
                event.target.value,
              )
            }
            required
            margin="normal"
            autoFocus
          />

          <TextField
            fullWidth
            label="Nombre del contacto"
            value={formData.contact_name}
            onChange={(event) =>
              onFieldChange(
                "contact_name",
                event.target.value,
              )
            }
            required
            margin="normal"
          />

          <TextField
            fullWidth
            type="email"
            label="Correo electrónico"
            value={formData.email}
            onChange={(event) =>
              onFieldChange(
                "email",
                event.target.value,
              )
            }
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Teléfono"
            value={formData.phone}
            onChange={(event) =>
              onFieldChange(
                "phone",
                event.target.value,
              )
            }
            required
            margin="normal"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
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