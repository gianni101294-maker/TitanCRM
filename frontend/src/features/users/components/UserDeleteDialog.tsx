import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { User } from "../api/users";

interface UserDeleteDialogProps {
  user: User | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function UserDeleteDialog({
  user,
  isDeleting,
  onClose,
  onConfirm,
}: UserDeleteDialogProps) {
  return (
    <Dialog
      open={Boolean(user)}
      onClose={
        isDeleting ? undefined : onClose
      }
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        Eliminar usuario
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que deseas eliminar a{" "}
          <strong>
            {user?.full_name}
          </strong>
          ?
        </DialogContentText>

        <Alert
          severity="warning"
          sx={{ mt: 2 }}
        >
          Esta acción no se puede deshacer.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancelar
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting
            ? "Eliminando..."
            : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}