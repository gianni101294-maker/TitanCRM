import type { Customer } from "../api/customers";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface CustomerDeleteDialogProps {
  customer: Customer | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CustomerDeleteDialog({
  customer,
  isDeleting,
  onClose,
  onConfirm,
}: CustomerDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(customer)}
      title="Eliminar cliente"
      description={
        <>
          ¿Estás seguro de que deseas eliminar al cliente{" "}
          <strong>{customer?.company_name}</strong>? Esta acción
          no se puede deshacer.
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