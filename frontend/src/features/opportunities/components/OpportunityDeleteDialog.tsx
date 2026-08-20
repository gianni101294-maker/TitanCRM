import type {
  Opportunity,
} from "../api/opportunities";

import {
  ConfirmDialog,
} from "@/components/common/ConfirmDialog";

interface OpportunityDeleteDialogProps {
  opportunity: Opportunity | null;

  isDeleting: boolean;

  onClose: () => void;

  onConfirm: () => void;
}

export function OpportunityDeleteDialog({
  opportunity,
  isDeleting,
  onClose,
  onConfirm,
}: OpportunityDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(
        opportunity,
      )}
      title="Eliminar oportunidad"
      description={
        <>
          ¿Estás seguro de que deseas
          eliminar la oportunidad{" "}
          <strong>
            {opportunity?.title}
          </strong>
          ? Esta acción no se puede
          deshacer.
        </>
      }
      confirmLabel="Eliminar"
      confirmColor="error"
      isLoading={
        isDeleting
      }
      onClose={
        onClose
      }
      onConfirm={
        onConfirm
      }
    />
  );
}