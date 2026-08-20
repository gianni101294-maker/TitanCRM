import type { OpportunityStage } from "../api/opportunities";

export const opportunityStageOptions = [
  {
    value: "prospect",
    label: "Prospecto",
    color: "default",
  },
  {
    value: "contacted",
    label: "Contactado",
    color: "info",
  },
  {
    value: "proposal",
    label: "Propuesta",
    color: "warning",
  },
  {
    value: "negotiation",
    label: "Negociación",
    color: "secondary",
  },
  {
    value: "won",
    label: "Ganado",
    color: "success",
  },
  {
    value: "lost",
    label: "Perdido",
    color: "error",
  },
] as const satisfies ReadonlyArray<{
  value: OpportunityStage;
  label: string;
  color:
    | "default"
    | "info"
    | "warning"
    | "secondary"
    | "success"
    | "error";
}>;

export function getOpportunityStageData(
  stage: OpportunityStage,
) {
  return (
    opportunityStageOptions.find(
      (option) => option.value === stage,
    ) ?? opportunityStageOptions[0]
  );
}