import type {
  Opportunity,
  OpportunityStage,
} from "@/features/opportunities";

export interface PipelineStageConfig {
  key: OpportunityStage;

  label: string;

  color:
    | "default"
    | "info"
    | "warning"
    | "secondary"
    | "success"
    | "error";
}

export const pipelineStageConfig:
  PipelineStageConfig[] = [
    {
      key: "prospect",
      label: "Prospecto",
      color: "default",
    },
    {
      key: "contacted",
      label: "Contactado",
      color: "info",
    },
    {
      key: "proposal",
      label: "Propuesta",
      color: "warning",
    },
    {
      key: "negotiation",
      label: "Negociación",
      color: "secondary",
    },
    {
      key: "won",
      label: "Ganado",
      color: "success",
    },
    {
      key: "lost",
      label: "Perdido",
      color: "error",
    },
  ];

export function getPipelineStageConfig(
  stage: OpportunityStage,
) {
  return (
    pipelineStageConfig.find(
      (stageConfig) =>
        stageConfig.key === stage,
    ) ?? pipelineStageConfig[0]
  );
}

export function formatPipelineCurrency(
  value: number | string,
) {
  return Number(
    value,
  ).toLocaleString(
    "es-PE",
    {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );
}

export function getPipelineStageValue(
  opportunities: Opportunity[],
) {
  return opportunities.reduce(
    (
      total,
      opportunity,
    ) =>
      total +
      Number(
        opportunity.value,
      ),
    0,
  );
}

export function getPipelineStageAverage(
  opportunities: Opportunity[],
) {
  if (
    opportunities.length === 0
  ) {
    return 0;
  }

  return (
    getPipelineStageValue(
      opportunities,
    ) /
    opportunities.length
  );
}