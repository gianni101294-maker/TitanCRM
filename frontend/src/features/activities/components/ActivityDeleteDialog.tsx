import type { Activity } from "../api/activities";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface ActivityDeleteDialogProps {
  activity: Activity | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ActivityDeleteDialog({
  activity,
  isDeleting,
  onClose,
  onConfirm,
}: ActivityDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(activity)}
      title="Eliminar actividad"
      description={
        <>
          ¿Estás seguro de que deseas eliminar la actividad{" "}
          <strong>{activity?.title}</strong>? Esta acción no se
          puede deshacer.
        </>
      }
      confirmLabel="Eliminar"
      confirmColor="error"
      isLoading={isDeleting}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}